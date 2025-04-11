import { useState } from "react";
import instagram from "../assets/instagram.png";
function TermsPage({ onGoToLoading }) {
  const [activo, setActivo] = useState(false);

  const handleClick = (e) => {
    if (e.pointerType === "mouse" || e.pointerType === "touch") {
      setActivo(!activo)

      onGoToLoading(e);

      // quitamos la clase después de un corto tiempo (por ejemplo 200ms)
      // setTimeout(() => {
      //   setActivo(false);
      // }, 200);
    }
  };

  return (
    <section className="section terms-page">
      <div className="terms-page-content">

        <div className="terms-page-copy">
          
        </div>
        <div className="intagram-button-container">
        <button
          className={`instagram-button ${activo ? "activo" : ""}`}
          onPointerUp={handleClick}
        
        >
          <img src={instagram} className={`icon ${activo ? "activo-img" : ""}`} />
          INSTAGRAM
        </button>

        </div>
      </div>
    </section>
  );
}

export default TermsPage;
