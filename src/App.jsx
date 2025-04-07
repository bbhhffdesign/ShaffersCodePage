import { useEffect, useState } from 'react';
import { claimDiscount } from './js/claimDiscount';

function App() {
  const [code, setCode] = useState(null);
  const [message, setMessage] = useState("Cargando...");
  const [isLoading, setIsLoading] = useState(true); // Añadir un estado de carga para evitar múltiples llamadas

  useEffect(() => {
    const fetchCode = async () => {
      console.log("Llamando a claimDiscount...");
      const res = await claimDiscount();
      console.log("Resultado de claimDiscount:", res);

      if (res.error) {
        setMessage(res.error);
      } else {
        setCode(res.code);
        setMessage(res.alreadyClaimed ? "Ya reclamaste tu código:" : "¡Aquí está tu código de descuento!");
      }

      setIsLoading(false); // Detener la carga una vez que el proceso haya terminado
    };

    // Solo hacer la llamada si no hay código o si aún está en proceso de carga
    if (isLoading && code === null) {
      fetchCode();
    }
  }, [isLoading, code]); // Agregar `isLoading` para asegurarse de que solo se ejecute una vez

  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>{message}</h1>
      {code && <h2 style={{ color: 'green', fontSize: '2rem' }}>{code}</h2>}
    </div>
  );
}

export default App;