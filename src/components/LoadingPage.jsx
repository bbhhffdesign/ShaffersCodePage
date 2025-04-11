import Button from "./Button";
function LoadingPage({ message }) {
    return (
      <section className="section loading-page">
        <div className="error-msj">

        {message ? (<Button>{message}</Button>) : ( "")}
          {/* <p>{message}</p> */}
        </div>
        
        <div className="loading-page-logo">
        </div>
      </section>
    );
  }
  
  export default LoadingPage;