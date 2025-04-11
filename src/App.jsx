import { useEffect, useState, useRef } from "react";
import { claimDiscount } from "./js/claimDiscount";
import LoadingPage from "./components/LoadingPage";
import MainPage from "./components/MainPage";
import TermsPage from "./components/TermsPage";

function App() {
  const [code, setCode] = useState(null);
  const [price, setPrice] = useState(null);
  const [message, setMessage] = useState("");
  const [hasError, setHasError] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [initialLoadTriggered, setInitialLoadTriggered] = useState(false);

  const [translateY, setTranslateY] = useState(100);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showMain, setShowMain] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [goToLoading, setGoToLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(true);
  const sectionsRef = useRef(null);

  const scrollToY = (vh) => setTranslateY(vh);

  // Escuchar cuando la página y assets hayan cargado completamente
  useEffect(() => {
    const handleAssetsLoaded = () => {
      console.log("✅ Todos los assets han cargado.");
      setAssetsLoaded(true);
    };

    if (document.readyState === "complete") {
      handleAssetsLoaded();
    } else {
      window.addEventListener("load", handleAssetsLoaded);
      return () => window.removeEventListener("load", handleAssetsLoaded);
    }
  }, []);

  // Cargar código y detectar errores al iniciar
  useEffect(() => {
    const fetchCode = async () => {
      console.log("🔍 Llamando a claimDiscount...");
      const res = await claimDiscount();
      console.log("🧾 Resultado de claimDiscount:", res);

      if (res.error) {
        setHasError(true);
        setMessage("Tenés que entrar desde un celular");
        return;
      }
      
      setCode(res.code);
      setPrice(res.price);
      // 👇 No seteamos ningún mensaje si no hubo error
      setMessage(""); 
      setDataLoaded(true);
    };

    fetchCode();
  }, []);

  // Lógica para activar la animación solo cuando:
  // - NO hay errores
  // - Se terminó de cargar data y assets
  useEffect(() => {
    if (!hasError && dataLoaded && assetsLoaded && !initialLoadTriggered) {
      console.log("🚀 Todo listo, lanzando animación de entrada.");
      setInitialLoadTriggered(true);
      setTimeout(() => {
        scrollToY(0);
        setInitialLoad(false);
      }, 400);
    }
  }, [hasError, dataLoaded, assetsLoaded, initialLoadTriggered]);

  // Manejo de transiciones secundarias
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (translateY === 220 && goToLoading) {
        setShowMain(false);
        setShowTerms(false);
        setTranslateY(200);
        setGoToLoading(false);
      }

      if (translateY === 0 && !initialLoad) {
        setShowTerms(true);
      }
    };

    const node = sectionsRef.current;
    node?.addEventListener("transitionend", handleTransitionEnd);
    return () => node?.removeEventListener("transitionend", handleTransitionEnd);
  }, [translateY, initialLoad, goToLoading]);

  const handleMainClick = () => {
    if (translateY === 78) {
      setIsClicked(false);
      scrollToY(0);
    }
  };

  const handleTransitionToLoading = () => {
    setShowLoading(true);
    setGoToLoading(true);

    setTimeout(() => {
      scrollToY(200);
    }, 600);

    setTimeout(() => {
      window.location.href = 'https://www.instagram.com/shaffers.co/';
      location.reload();
    }, 1500);
  };

  return (
    <div className="app">
      <div
        className="sections"
        ref={sectionsRef}
        style={{ transform: `translateY(-${translateY}svh)` }}
      >
        {showMain && (
          <MainPage
            onClick={handleMainClick}
            onScroll={() => {
              setIsClicked(true);
              scrollToY(78);
            }}
            isClicked={isClicked}
            code={code}
            price={price}
          />
        )}
        {showTerms && (
          <TermsPage
            onGoToLoading={handleTransitionToLoading}
            isClicked={isClicked}
          />
        )}
        {showLoading && <LoadingPage message={hasError ? message : ""} />}
      </div>
    </div>
  );
  
}

export default App;
