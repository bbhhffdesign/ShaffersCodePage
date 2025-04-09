// import { Background } from "./Background"
import { useState } from "react";
import { Background } from "./Background";
import Button from "./Button";

function MainPage({ onClick, onScroll, isClicked }) {
  const [animateDani, setAnimateDani] = useState(false);

  const handleScrollClick = (e) => {
    e.stopPropagation();
    setAnimateDani(true); // activamos la animación
    onScroll();
  };

  return (
    <section
      className={
        "section main-page"
        // isClicked ? "section main-page" : "section main-page"
      }
      onClick={onClick}
    >
      <div className="main-page-content">
        <div className="discount-code-container">
          <p>Te ganaste un descuento de 20% en nuestra próxima nueva burguer</p>
          <Button className={"discount-code"}>
            <h1>SH-12SD53</h1>
            <small>Sacale Screen, o Click para copiarlo.</small>
          </Button>
        </div>
        {/* <div className={`dani-container ${isClicked ? "animate-dani" : ""}`}></div> */}
        <div className={`dani-container ${isClicked ? "animate-dani" : ""} ${animateDani ? "animate-dani-active" : ""}`}></div>
        <div className="button-container">
        <Button
            className={"btn btn-main-page "}
            onClick={handleScrollClick}
          >
            ¿Cómo aplicar el descuento?
          </Button>
        </div>
      </div>
      <Background />
    </section>
  );
}

export default MainPage;
