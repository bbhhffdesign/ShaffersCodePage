import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { getFingerprint } from "./fingerprintjs";


// Verificaciones de entorno
const isMobile = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isiOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

const isDevToolsOpen = () => {
  const threshold = 160;
  return (window.outerWidth - window.innerWidth > threshold) || (window.outerHeight - window.innerHeight > threshold);
};

const detectDevToolsViaConsole = () => {
  let devtoolsOpen = false;
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function () { devtoolsOpen = true; }
  });
  console.log('%c', element);
  return devtoolsOpen;
};

const isViewportSuspicious = () => {
  const screenHeight = window.screen.height;
  const innerHeight = window.innerHeight;
  return screenHeight - innerHeight < 100;
};

const isLikelyEmulatedMobile = () => {
  const ratio = window.screen.width / window.innerWidth;
  return ratio > 1.2 || ratio < 0.8;
};

const hasTouchSupport = () => (
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0
);

const userAgentMismatch = () => {
  if (navigator.userAgentData && navigator.userAgent) {
    return !navigator.userAgentData.mobile && /Mobi|Android/i.test(navigator.userAgent);
  }
  return false;
};

const isSuspiciousMobileSim = () => {
  if (isiOS()) return false; // ⬅️ IMPORTANTE: evitamos falsos positivos en iOS
  return (
    isViewportSuspicious() ||
    !hasTouchSupport() ||
    userAgentMismatch() ||
    isLikelyEmulatedMobile()
  );
};

// Función principal
export const claimDiscount = async () => {
  if (!isMobile()) {
    return { error: "Solo se permite desde dispositivos móviles reales." };
  }

  if (isDevToolsOpen() || detectDevToolsViaConsole()) {
    return { error: "Acceso denegado por uso de herramientas de desarrollo." };
  }

  if (isSuspiciousMobileSim()) {
    return { error: "Acceso denegado por simulación de dispositivo móvil." };
  }

  const fingerprint = await getFingerprint();

  const claimsRef = collection(db, "claims");
  const existingSnap = await getDocs(query(claimsRef, where("fingerprint", "==", fingerprint)));

  if (!existingSnap.empty) {
    const existing = existingSnap.docs[0].data();
    return { code: existing.code, price: existing.price, alreadyClaimed: true };
  }

  const codesSnap = await getDocs(query(collection(db, "discountCodes"), where("claimed", "==", false)));

  if (codesSnap.empty) {
    return { error: "No hay más códigos disponibles." };
  }

  const codeDoc = codesSnap.docs[0];
  const codeData = codeDoc.data();

  await updateDoc(doc(db, "discountCodes", codeDoc.id), { claimed: true });

  await addDoc(claimsRef, {
    fingerprint,
    code: codeData.code,
    price: codeData.price,
    claimedAt: new Date(),
  });

  return { code: codeData.code, price: codeData.price, alreadyClaimed: false };
};
