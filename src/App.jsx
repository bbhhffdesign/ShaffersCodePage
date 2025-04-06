import { useEffect, useState } from 'react';
import { claimDiscount } from './js/claimDiscount';

function App() {
  const [code, setCode] = useState(null);
  const [message, setMessage] = useState("Cargando...");

  useEffect(() => {
    const fetchCode = async () => {
      const res = await claimDiscount();
      if (res.error) {
        setMessage(res.error);
      } else {
        setCode(res.code);
        setMessage(res.alreadyClaimed ? "Ya reclamaste tu código:" : "¡Aquí está tu código:");
      }
    };

    fetchCode();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>{message}</h1>
      {code && <h2 style={{ color: 'green' }}>{code}</h2>}
    </div>
  );
}

export default App;
