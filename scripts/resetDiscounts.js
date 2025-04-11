import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

// Cargar la clave privada
const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'));

// Inicializar Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function resetDiscounts() {
  const discountCodesRef = db.collection('discountCodes');
  const claimsRef = db.collection('claims');

  // 🔁 1. Setear todos los "claimed" en false
  const discountSnapshot = await discountCodesRef.get();
  const discountBatch = db.batch();

  discountSnapshot.forEach((doc) => {
    discountBatch.update(doc.ref, { claimed: false });
  });

  await discountBatch.commit();
  console.log(`✅ ${discountSnapshot.size} códigos actualizados a claimed: false`);

  // 🧹 2. Borrar todos los documentos en "claims"
  const claimsSnapshot = await claimsRef.get();
  const deleteBatch = db.batch();

  claimsSnapshot.forEach((doc) => {
    deleteBatch.delete(doc.ref);
  });

  await deleteBatch.commit();
  console.log(`🗑️ ${claimsSnapshot.size} documentos eliminados de la colección 'claims'`);
}

resetDiscounts().catch(console.error);
