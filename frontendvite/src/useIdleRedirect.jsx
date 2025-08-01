import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useIdleRedirect = (timeout = 600000) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.clear(); // Déconnexion
        navigate("/login", { replace: true });
      }, timeout);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // Lancer au début

    return () => {
      clearTimeout(timer);
      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [navigate, timeout]);
};

export default useIdleRedirect;
