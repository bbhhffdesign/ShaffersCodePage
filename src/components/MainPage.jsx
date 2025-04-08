// import { Background } from "./Background"
import { Background } from "./Background";

function MainPage({ onClick, onScroll, isClicked }) {
  return (
    <section className={isClicked ? "section main-page" : "section main-page main-page-toggle"} onClick={onClick}>
      <div className="main-page-content">
        <div className="discount-code-container">
          <p>Te ganaste un descuento de 20% en nuestra próxima nueva burguer</p>
          <button className="discount-code">
            <h1>SH-12SD53</h1>
            <small>Sacale Screen, o Click para copiarlo.</small>
          </button>
        </div>
        <div className="dani-container">{/* <img srcSet="" alt="" /> */}</div>
        <div className="button-container">
          <button
            className="btn btn-main-page"
            onClick={(e) => {
              e.stopPropagation();
              onScroll();
            }}
          >
            ¿Como aplicar el descuento?
          </button>
        </div>
      </div>
      <Background />
    </section>
  );
}

export default MainPage;
