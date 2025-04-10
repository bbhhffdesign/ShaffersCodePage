import { useState } from "react";
import { Background } from "./Background";
import Button from "./Button";

function MainPage({ onClick, onScroll, isClicked }) {
  const specialColors = ["#EFA52E", "#1AB4B3", "#45B052", "#E51F24"];
  const patternColors = ["#000"];
  specialColors.forEach((color, index) => {
    patternColors.push(color);
    if (index !== specialColors.length - 1) {
      patternColors.push("#000");
    }
  });
  const [colorIndex, setColorIndex] = useState(0);
  const [isPressed, setIsPressed] = useState(false);

  // Función para cambiar el color
  const incrementColor = () => {
    setColorIndex((prev) => (prev + 1) % patternColors.length);
  };

  const handleScrollClick = (e) => {
    e.stopPropagation();
    onScroll();
  };

  return (
    <section className="section main-page" onClick={onClick}>
      <div className="main-page-content">
        <div className="discount-code-container">
          <div className="discount-text-container">
            <p>Te ganaste </p>
            <h3 style={{ color: patternColors[colorIndex] }}>20% OFF</h3>
          </div>
          <Button
            className={`discount-code ${isPressed ? "tapar-sombra" : ""}`}
            // Usamos pointer events para unificar el comportamiento
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => {
              setIsPressed(false);
              incrementColor();
            }}
          >
            <h1>SH-12SD53</h1>
            <small>Sacale Screen, o Click para copiarlo.</small>
          </Button>
        </div>
        <div className="dani-container">
          <div className="dani-container dani-globo"></div>
        </div>

        <div className="button-container">
          <Button className="btn btn-main-page" onClick={handleScrollClick}>
            ¿Cómo aplicar el descuento?
          </Button>
        </div>
      </div>
      <Background />
    </section>
  );
}

export default MainPage;
