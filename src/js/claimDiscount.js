import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getFingerprint } from "./fingerprintjs";

const getPublicIP = async () => {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
};

const getDeviceInfo = () => {
  try {
    if (navigator.userAgentData) {
      const brands = navigator.userAgentData.brands?.map(b => `${b.brand}/${b.version}`).join(", ");
      const platform = navigator.userAgentData.platform || "Unknown Platform";
      
      if (brands) {
        return `${brands} - ${platform}`;
      }
    }
    return navigator.userAgent || "Unknown";
  } catch (error) {
    console.warn("Error detectando device info:", error);
    return "Unknown";
  }
};

export const claimDiscount = async () => {
  const fingerprint = await getFingerprint();
  const ip = await getPublicIP();
  const deviceInfo = getDeviceInfo();

  console.log("Fingerprint:", fingerprint);
  console.log("IP pública:", ip);
  console.log("Device info:", deviceInfo);

  const claimsRef = collection(db, "claims");

  // Verifica si ya existe fingerprint o IP
  const q1 = query(claimsRef, where("fingerprint", "==", fingerprint));
  const q2 = query(claimsRef, where("ip", "==", ip));

  const [existingByFingerprint, existingByIP] = await Promise.all([
    getDocs(q1),
    getDocs(q2)
  ]);

  const existing = !existingByFingerprint.empty || !existingByIP.empty;

  if (existing) {
    const docSnap = !existingByFingerprint.empty ? existingByFingerprint.docs[0] : existingByIP.docs[0];
    console.log("Usuario ya tiene código:", docSnap.data().code);
    return { code: docSnap.data().code, alreadyClaimed: true };
  }

  // Busca un código no usado
  const codesRef = collection(db, "discountCodes");
  const available = query(codesRef, where("claimed", "==", false));
  const codeDocs = await getDocs(available);

  if (codeDocs.empty) {
    return { error: "No hay más códigos disponibles." };
  }

  const codeDoc = codeDocs.docs[0];
  const codeData = codeDoc.data();

  await updateDoc(doc(db, "discountCodes", codeDoc.id), {
    claimed: true,
  });

  await addDoc(claimsRef, {
    fingerprint,
    ip,
    deviceInfo,
    code: codeData.code,
    claimedAt: new Date(),
  });

  console.log("Código asignado:", codeData.code);
  return { code: codeData.code, alreadyClaimed: false };
};
