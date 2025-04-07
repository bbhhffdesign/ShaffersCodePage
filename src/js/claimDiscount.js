import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getFingerprint } from "./fingerprintjs";

// Función para obtener IP pública
const getPublicIP = async () => {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
};

// Función para obtener información del dispositivo
const getDeviceInfo = () => {
  try {
    if (navigator.userAgentData) {
      const brands = navigator.userAgentData.brands?.map(b => `${b.brand}/${b.version}`).join(", ");
      const platform = navigator.userAgentData.platform || "Unknown Platform";
      if (brands) return `${brands} - ${platform}`;
    }
    return navigator.userAgent || "Unknown";
  } catch (error) {
    console.warn("Error detectando device info:", error);
    return "Unknown";
  }
};

// Función para generar un hash simple
const generateHash = async (input) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

// ✅ Detecta si es un dispositivo móvil
const isMobile = () => {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

// ✅ Detecta si DevTools están abiertos (técnica combinada)
const isDevToolsOpen = () => {
  const threshold = 160;
  const widthCheck = window.outerWidth - window.innerWidth > threshold;
  const heightCheck = window.outerHeight - window.innerHeight > threshold;
  return widthCheck || heightCheck;
};

const detectDevToolsViaConsole = () => {
  let devtoolsOpen = false;
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function () {
      devtoolsOpen = true;
    }
  });
  console.log('%c', element);
  return devtoolsOpen;
};

// ✅ Verifica si la IP es de Buenos Aires, Argentina
const isIPFromBuenosAires = async (ip) => {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`);
    const data = await res.json();

    if (!data.success) {
      console.warn("Fallo al obtener ubicación:", data.message);
      return false;
    }

    console.log(`Ubicación detectada: ${data.city}, ${data.region}, ${data.country}`);
    return data.country_code === "AR";
  } catch (error) {
    console.warn("Error al verificar IP con ipwho.is:", error);
    return false;
  }
};

// Función principal
export const claimDiscount = async () => {
  // ✅ Bloqueo por DevTools
  if (isDevToolsOpen() || detectDevToolsViaConsole()) {
    console.log("DevTools detectado. Acceso denegado.");
    return { error: "Acceso denegado por herramientas de desarrollo." };
  }

  // ✅ Solo desde dispositivos móviles
  if (!isMobile()) {
    console.log("Dispositivo no móvil. Acceso denegado.");
    return { error: "Solo se permite el acceso desde dispositivos móviles." };
  }

  const fingerprint = await getFingerprint();
  const ip = await getPublicIP();
  const deviceInfo = getDeviceInfo();
  const userAgent = navigator.userAgent;
  const language = navigator.language || "unknown";
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";

  // ✅ Bloqueo si no es de Buenos Aires
  const isFromBA = await isIPFromBuenosAires(ip);
  if (!isFromBA) {
    console.log("IP fuera de Buenos Aires. Acceso denegado.");
    return { error: "Acceso restringido solo a Buenos Aires, Argentina." };
  }

  // Generamos el hash compuesto
  const combinedInfo = `${fingerprint}|${ip}|${deviceInfo}|${userAgent}|${language}|${timezone}`;
  const deviceHash = await generateHash(combinedInfo);

  console.log("Fingerprint:", fingerprint);
  console.log("IP pública:", ip);
  console.log("Device info:", deviceInfo);
  console.log("User-Agent:", userAgent);
  console.log("Language:", language);
  console.log("Timezone:", timezone);
  console.log("Device Hash:", deviceHash);

  const claimsRef = collection(db, "claims");

  // Verificamos si ya hay algún match
  const queries = [
    query(claimsRef, where("fingerprint", "==", fingerprint)),
    query(claimsRef, where("ip", "==", ip)),
    query(claimsRef, where("userAgent", "==", userAgent)),
    query(claimsRef, where("language", "==", language)),
    query(claimsRef, where("deviceHash", "==", deviceHash))
  ];

  const results = await Promise.all(queries.map(getDocs));
  const existing = results.some(result => !result.empty);

  if (existing) {
    const foundDoc = results.find(result => !result.empty)?.docs[0];
    console.log("Usuario ya tiene código:", foundDoc.data().code);
    return { code: foundDoc.data().code, alreadyClaimed: true };
  }

  // Buscar código disponible
  const codesRef = collection(db, "discountCodes");
  const available = query(codesRef, where("claimed", "==", false));
  const codeDocs = await getDocs(available);

  if (codeDocs.empty) {
    return { error: "No hay más códigos disponibles." };
  }

  const codeDoc = codeDocs.docs[0];
  const codeData = codeDoc.data();

  await updateDoc(doc(db, "discountCodes", codeDoc.id), { claimed: true });

  await addDoc(claimsRef, {
    fingerprint,
    ip,
    deviceInfo,
    userAgent,
    language,
    timezone,
    deviceHash,
    code: codeData.code,
    claimedAt: new Date(),
  });

  console.log("Código asignado:", codeData.code);
  return { code: codeData.code, alreadyClaimed: false };
};