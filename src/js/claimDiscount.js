import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { getFingerprint } from "./fingerprintjs";

// Función para obtener la IP pública
const getPublicIP = async () => {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
};

const isAllowedLocation = async (ip) => {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();

    const country = data.country || "unknown";
    const region = data.region || "unknown";
    const city = data.city || "unknown";

    console.log("Ubicación detectada:", { country, region, city });

    // Solo permitimos Argentina, y opcionalmente Buenos Aires
    const allowedCountry = country === "AR";
    const allowedRegion =
      region.toLowerCase().includes("buenos aires") ||
      city.toLowerCase().includes("buenos aires");

    return allowedCountry && allowedRegion;
  } catch (error) {
    console.warn("Error obteniendo ubicación:", error);
    return false; // si falla, no permitimos por precaución
  }
};

const isMobileDevice = () => {
  const ua = navigator.userAgent.toLowerCase();
  return /mobile|android|iphone|ipad|ipod|opera mini|iemobile/i.test(ua);
};

// Función para obtener información del dispositivo
const getDeviceInfo = () => {
  try {
    if (navigator.userAgentData) {
      const brands = navigator.userAgentData.brands
        ?.map((b) => `${b.brand}/${b.version}`)
        .join(", ");
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
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const claimDiscount = async () => {

  
  const fingerprint = await getFingerprint();
  const ip = await getPublicIP();
  const deviceInfo = getDeviceInfo();
  const userAgent = navigator.userAgent;
  const language = navigator.language || "unknown";
  const timezone =
  Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
  
  const isFromAllowedLocation = await isAllowedLocation(ip);
  if (!isFromAllowedLocation) {
    console.log("Ubicación no permitida. Código no otorgado.");
    return {
      error: "Esta promoción solo está disponible en Buenos Aires, Argentina.",
    };
  }
  if (!isMobileDevice()) {
    console.log("Dispositivo no móvil. Acceso denegado.");
    return { error: "Esta promoción solo está disponible desde dispositivos móviles." };
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
    query(claimsRef, where("deviceHash", "==", deviceHash)),
  ];

  const results = await Promise.all(queries.map(getDocs));
  const existing = results.some((result) => !result.empty);

  if (existing) {
    const foundDoc = results.find((result) => !result.empty)?.docs[0];
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
