import instagram from "../assets/instagram.png";
function TermsPage({ onGoToLoading }) {
  return (
    <section className="section terms-page">
      <div className="terms-page-content">
        {/* <div className="terms-page-copy">
          <p>
            ¡ Hola, yo soy el <strong className="text-alt-clr">Dani</strong> y
            vine porque quiero hacerte un regalo !
            <br /><br />
            
            Acá arriba tenés un <strong>CÓDIGO</strong> que vas a poder canjear
            por el beneficio mencionado arriba. <br />
            <br />
            <p className="text-alt-sm">
            Podés sacarle <strong>screen</strong> o <strong>copiarlo </strong>
            con el botón y me lo envías cuando hagas tu pedido por <span className="text-alt-green">Whatsapp</span> a partir
            de la <strong>semana que viene (16/4/2025)</strong>.<br />
            </p>
          </p>
          <p>
            Todavía no me conocen pero YO soy el CEO de Shaffer's... <br />
            Bueno, tambíen limpio, cocino, tomo los pedidos y hago las compras.
          </p>
          <p className="text-alt-black"><i>Ustedes son las únicas personas que me conocen, asique no le cuenten a la gente de Instagram todavia</i></p>
        </div> */}
        <div className="terms-page-copy">
          
        </div>
        <div className="intagram-button-container">
        <button
          className="instagram-button"
          onPointerUp={(e) => {
            if (e.pointerType === "mouse" || e.pointerType === "touch") {
              onGoToLoading(e);
            }
          }}
        >
          <img src={instagram} className="icon" />
          INSTAGRAM
        </button>

        </div>
      </div>
      {/* <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, nam.</p>
        <h1>Términos y Condiciones</h1> */}
    </section>
  );
}

export default TermsPage;
