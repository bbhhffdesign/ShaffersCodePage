import { useState } from "react";
import { Background } from "./Background";
import Button from "./Button";

function MainPage({ onClick, onScroll, isClicked }) {
  const [animateDani, setAnimateDani] = useState(false);
  const [colorClass, setColorClass] = useState("");
  const [withTransition, setWithTransition] = useState(false);
  const [touchCycle, setTouchCycle] = useState(0);

  const colors = ["rojo", "verde", "azul"];

  const handleScrollClick = (e) => {
    e.stopPropagation();
    setAnimateDani(true);
    onScroll();
  };


  const handleTouchStart = () => {
    const nextColor = colors[touchCycle];
    // Forzamos que se reinicie la animación cada vez
    setColorClass("");
    // Esperamos un momento para reiniciar la clase y asegurar que la animación se reinicie si se toca rápidamente
    setTimeout(() => {
      setColorClass(`color-animation-${nextColor}`);
    }, 10);
  };
  
  const handleTouchEnd = () => {
    setColorClass(""); // Cambio abrupto a negro
    setTouchCycle((prev) => (prev + 1) % colors.length);
  };

  return (
    <section className="section main-page" onClick={onClick}>
      <div className="main-page-content">
        <div className="discount-code-container">
          <div className="discount-text-container">
            <p>Te ganaste </p>
            <h3 className={`discount-text ${colorClass} ${withTransition ? "color-transition" : ""}`}>
  20% OFF
</h3>
          </div>
          <Button
  className={`discount-code ${colorClass}`}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
  onMouseDown={handleTouchStart}
  onMouseUp={handleTouchEnd}
>
            <h1>SH-12SD53</h1>
            <small>Sacale Screen, o Click para copiarlo.</small>
          </Button>
        </div>
        <div className="dani-container"></div>
        <div className="button-container">
          <Button className={"btn btn-main-page"} onClick={handleScrollClick}>
            ¿Cómo aplicar el descuento?
          </Button>
        </div>
      </div>
      <Background />
    </section>
  );
}

export default MainPage;