import { useEffect, useState, useRef } from "react";
import { claimDiscount } from "./js/claimDiscount";
import LoadingPage from "./components/LoadingPage";
import MainPage from "./components/MainPage";
import TermsPage from "./components/TermsPage";

function App() {
  const [code, setCode] = useState(null);
  const [message, setMessage] = useState("Cargando...");
  const [isLoading, setIsLoading] = useState(true); // Añadir un estado de carga para evitar múltiples llamadas
  ///
  const [translateY, setTranslateY] = useState(100);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [showMain, setShowMain] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [goToLoading, setGoToLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(true);
  const sectionsRef = useRef(null);

  const scrollToY = (vh) => setTranslateY(vh);

  useEffect(() => {
    const handlePageLoad = () => {
      console.log("✅ Toda la página ha cargado. Comenzamos animación.");
      setTimeout(() => {
        scrollToY(0);
        setInitialLoad(false);
      }, 400);
    };
  
    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
      return () => window.removeEventListener("load", handlePageLoad);
    }
  }, []);

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
      setIsClicked(false); // volver a posición original
        scrollToY(0);
  
    }
  };

  const handleTransitionToLoading = () => {
    setShowLoading(true); 
    setGoToLoading(true);
  
    setTimeout(() => {
      // scrollToY(200);
    }, 400);
  
    setTimeout(() => {
      // window.location.href = 'https://www.instagram.com/shaffers.co/';
      // location.reload(); 
    }, 1500);
  };

///

  useEffect(() => {
    const fetchCode = async () => {
      console.log("Llamando a claimDiscount...");
      const res = await claimDiscount();
      console.log("Resultado de claimDiscount:", res);

      if (res.error) {
        setMessage(res.error);
      } else {
        setCode(res.code);
        setMessage(
          res.alreadyClaimed
            ? "Ya reclamaste tu código:"
            : "¡Aquí está tu código de descuento!"
        );
      }

      setIsLoading(false); // Detener la carga una vez que el proceso haya terminado
    };

    // Solo hacer la llamada si no hay código o si aún está en proceso de carga
    if (isLoading && code === null) {
      fetchCode();
    }
  }, [isLoading, code]); // Agregar `isLoading` para asegurarse de que solo se ejecute una vez

  return (
    <>
    {/* <div className="nav-bar-device"></div> */}
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
        />
        )}
        {showTerms && (
          <TermsPage onGoToLoading={handleTransitionToLoading} isClicked={isClicked} />
        )}
        {showLoading && <LoadingPage />}
      </div>
    </div>

      {/* <div className='discount-code-container' style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>{message}</h1>
      {code && <h2 style={{ color: 'green', fontSize: '2rem' }}>{code}</h2>}
    </div> */}
    </>
  );
}

export default App;
