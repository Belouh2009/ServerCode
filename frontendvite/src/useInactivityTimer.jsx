import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";

const useInactivityTimer = (timeoutMinutes = 2, isTestMode = true) => {
  const navigate = useNavigate();
  
  // Configuration des temps en fonction du mode
  const config = {
    test: {
      timeout: 2, // 2 minutes
      warningBefore: 1, // Avertir 1 minute avant
      messagePrefix: "(Mode test) "
    },
    production: {
      timeout: 720, // 12 heures (720 minutes)
      warningBefore: 5, // Avertir 5 minutes avant
      messagePrefix: ""
    }
  };

  const { timeout, warningBefore, messagePrefix } = isTestMode ? config.test : config.production;

  // Conversion en millisecondes
  const timeoutMs = timeout * 60 * 1000;
  const warningTime = warningBefore * 60 * 1000;

  useEffect(() => {
    let inactivityTimer;
    let warningTimer;

    const clearSession = () => {
      // Suppression sélective des éléments du localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("division");
      localStorage.removeItem("lastActivity");
    };

    const showWarning = () => {
      Modal.warning({
        title: `${messagePrefix}Session sur le point d'expirer`,
        content: `Votre session expirera dans ${warningBefore} minute(s) par inactivité.`,
        okText: 'Rester connecté',
        onOk: () => {
          localStorage.setItem("lastActivity", Date.now());
          resetTimers();
        },
        onCancel: () => resetTimers()
      });
    };

    const logout = () => {
      clearSession();
      message.info(`${messagePrefix}Session expirée après ${timeout} minute(s) d'inactivité`);
      navigate('/login', { replace: true });
    };

    const resetTimers = () => {
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);

      // Timer pour l'avertissement
      warningTimer = setTimeout(showWarning, timeoutMs - warningTime);

      // Timer pour la déconnexion
      inactivityTimer = setTimeout(logout, timeoutMs);
    };

    const handleActivity = () => {
      localStorage.setItem("lastActivity", Date.now());
      resetTimers();
    };

    // Événements surveillés
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "keydown"
    ];

    // Ajout des listeners
    activityEvents.forEach(event => 
      window.addEventListener(event, handleActivity, { passive: true })
    );

    // Vérification initiale
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity && Date.now() - lastActivity > timeoutMs) {
      logout();
    } else {
      resetTimers();
    }

    // Nettoyage
    return () => {
      activityEvents.forEach(event => 
        window.removeEventListener(event, handleActivity)
      );
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
    };
  }, [navigate, timeoutMs, warningTime, messagePrefix, timeout, warningBefore]);

  // Retourne une fonction pour reset manuellement le timer si besoin
  return () => {
    localStorage.setItem("lastActivity", Date.now());
  };
};

export default useInactivityTimer;