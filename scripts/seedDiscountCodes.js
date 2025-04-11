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

// 🔸 Ingresá los códigos acá como un array de objetos:
const codes = [
  { code: 'SH-9X3K2L', price: 'PAPAS EXTRA', claimed: false },
  { code: 'SH-Y8J4D1', price: 'MEDALLON EXTRA', claimed: false },
  { code: 'SH-V3B7N9', price: 'MEDALLON EXTRA', claimed: false },
  { code: 'SH-W6Z2K8', price: '10% OFF', claimed: false },
  { code: 'SH-P9J1A2', price: '10% OFF', claimed: false },
  { code: 'SH-Q3M4N5', price: '10% OFF', claimed: false },
  { code: 'SH-F9V5G1', price: '10% OFF', claimed: false },
  { code: 'SH-A1R2D9', price: '10% OFF', claimed: false },
  { code: 'SH-T8L5X3', price: '10% OFF', claimed: false },
  { code: 'SH-B4Y6E7', price: '10% OFF', claimed: false }
];

async function seedCodes() {
  const batch = db.batch();

  codes.forEach((data) => {
    const docRef = db.collection('discountCodes').doc(); // 🔥 ID automática
    batch.set(docRef, data);
  });

  await batch.commit();
  console.log(`${codes.length} códigos cargados exitosamente ✅`);
}

seedCodes().catch(console.error);