import { useState } from "react";

const Button = ({ children, className, ...props }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressStart = () => setIsPressed(true);
  const handlePressEnd = () => setIsPressed(false);

  return (
    <button
      className={`${className} ${isPressed ? "pressed" : ""}`}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;