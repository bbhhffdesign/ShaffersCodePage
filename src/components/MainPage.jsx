import { useState, useRef } from "react";
import { Background } from "./Background";
import Button from "./Button";

function MainPage({ onClick, onScroll, isClicked }) {
  const [animate, setAnimate] = useState(false);
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
  const [hasScrolled, setHasScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef(null);
  const discountCode = "SH-12SD53";


   const incrementColor = () => {
    setColorIndex((prev) => (prev + 1) % patternColors.length);
  };

  const handleDiscountClick = () => {
    if (!copied) {
      // 👇 Fallback manual para copiar (compatible con móviles)
      const textArea = document.createElement("textarea");
      textArea.value = discountCode;
      textArea.style.position = "fixed";  // evita scroll en iOS
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
  
      try {
        document.execCommand("copy");
      } catch (err) {
        console.error("Error copiando texto manualmente:", err);
      }
  
      document.body.removeChild(textArea);
  
      // Activamos el mensaje copiado
      setCopied(true);
      copiedTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  const handleScrollClick = (e) => {
    e.stopPropagation();

    if (!hasScrolled) {
      setAnimate((prev) => !prev);
      onScroll();
      setHasScrolled(true);
    } else {
      setAnimate((prev) => !prev);
      if (onClick) onClick();
      setHasScrolled(false);
    }
  };

  return (
    <section className="section main-page">
      <div className="main-page-content">
        <div className="discount-code-container">
          <div className="discount-text-container">
            <div className="daniel-te-regala"></div>
            <h4 style={{ color: patternColors[colorIndex] }}>20% OFF</h4>
          </div>
          <Button
            className={`discount-code ${isPressed ? "tapar-sombra" : ""}`}
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => {
              setIsPressed(false);
              incrementColor();
              handleDiscountClick(); // NUEVO: activamos el mensaje copiado
            }}
          >
            <h1>SH-12SD53</h1>
            <small>
              {copied
                ? "Codigo copiado"
                : "Sacale Screen, o Click para copiarlo."}
            </small>
          </Button>
        </div>

        <div className={`dani-container ${animate ? "animated" : ""}`}>
          <div className="dani-container dani-globo"></div>
        </div>

        <div className="button-container">
          <Button
            className="btn btn-main-page"
            onPointerUp={(e) => {
              if (e.pointerType === "mouse" || e.pointerType === "touch") {
                handleScrollClick(e);
              }
            }}
          >
            {hasScrolled ? "VOLVER AL CÓDIGO  " : "¿Que hago con el código?"}
          </Button>
        </div>
      </div>
      <Background animate={animate} />
    </section>
  );
}

export default MainPage;
