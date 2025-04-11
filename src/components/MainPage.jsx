import { useState, useRef } from "react";
import { Background } from "./Background";
import Button from "./Button";

function MainPage({ onClick, onScroll, isClicked, code, price }) {
  const [animate, setAnimate] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [useAltColor, setUseAltColor] = useState(false);
  const copiedTimeoutRef = useRef(null);

  const handleDiscountClick = async () => {
    if (!copied && code) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        copiedTimeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, 1000);
      } catch (err) {
        console.error("Error copiando con Clipboard API:", err);
      }
    }
  };

  const handleScrollClick = (e) => {
    e.stopPropagation();
    setAnimate((prev) => !prev);

    if (!hasScrolled) {
      onScroll();
      setHasScrolled(true);
    } else {
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
            <h4 className="price-text" 
            style={{ color: useAltColor ? "#4E3718" : "#EFA52E" }}
            >
              {price ? `${price}` : "\u00A0"}
              {/* PAPAS FREE */}
            </h4>
          </div>
          <Button
            className={`discount-code ${isPressed ? "tapar-sombra" : ""}`}
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => {
              setIsPressed(false);
              setUseAltColor((prev) => !prev); // alternar color
              handleDiscountClick();
            }}
          >
            <h1>{code || "SH-XXXXXX"}</h1>
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
            {hasScrolled ? "VOLVER AL CÓDIGO" : "¿Que hago con el código?"}
          </Button>
        </div>
      </div>
      <Background animate={animate} />
    </section>
  );
}

export default MainPage;
