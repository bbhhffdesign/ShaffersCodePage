import { collection, getDocs, query, where, addDoc, doc, updateDoc } from "firebase/firestore";
// import { db } from "./firebase";
import { db } from "../config/firebase";
import { getFingerprint } from "./fingerprintjs";

export const claimDiscount = async () => {
  const fingerprint = await getFingerprint();

  // Verifica si este usuario ya reclamó
  const claimsRef = collection(db, "claims");
  const q = query(claimsRef, where("fingerprint", "==", fingerprint));
  const existing = await getDocs(q);

  if (!existing.empty) {
    const docSnap = existing.docs[0];
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

  // Marcar código como usado
  await updateDoc(doc(db, "discountCodes", codeDoc.id), {
    claimed: true,
  });

  // Guardar reclamo
  await addDoc(claimsRef, {
    fingerprint,
    code: codeData.code,
    claimedAt: new Date(),
  });

  return { code: codeData.code, alreadyClaimed: false };
};