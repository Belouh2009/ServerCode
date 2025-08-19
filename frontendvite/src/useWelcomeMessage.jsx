import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { SmileOutlined } from '@ant-design/icons';

export const useWelcomeMessage = (userInfo, options = {}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const welcomeShown = useRef(false);

  // Paramètres configurables avec valeurs par défaut
  const {
    duration = 5,       
    maxWidth = 400,     
    animationDuration = 0.5, 
    messageType = 'success' 
  } = options;

  useEffect(() => {
    if (userInfo && !welcomeShown.current) {
      welcomeShown.current = true;
      
      messageApi[messageType]({
        content: (
          <div className="welcome-message-content">
            <SmileOutlined className="welcome-icon" />
            <span>Bienvenue, {userInfo.prenom || userInfo.username} !</span>
          </div>
        ),
        duration,
        className: 'custom-welcome-message',
        style: {
          marginTop: '60px',
          maxWidth: `${maxWidth}px`,
          animation: `slideInDown ${animationDuration}s ease-out`
        },
        onClose: () => {
          welcomeShown.current = false;
        }
      });
    }
  }, [userInfo, messageApi, duration, maxWidth, animationDuration, messageType]);

  return contextHolder;
};