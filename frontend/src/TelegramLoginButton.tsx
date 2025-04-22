import  { useEffect, useRef, useState } from 'react';
import { TelegramLoginData } from './components/services/endpoints.ts';

// Расширяем глобальный объект window, чтобы TypeScript не ругался
declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramLoginData) => void;
  }
}


const BOT_USERNAME = import.meta.env.VITE_TG_BOT_USERNAME;

type Props = {
  dataOnauth: (userData: TelegramLoginData) => void
};

export const TelegramLogin = ({dataOnauth}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [user] = useState<TelegramLoginData | null>(null);

  useEffect(() => {
    // 1) Определяем глобальную callback-функцию
    window.onTelegramAuth = dataOnauth;

    // 2) Динамически создаём <script> для виджета
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    // указываем имя глобальной функции без кавычек
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');

    // 3) Вставляем скрипт в контейнер
    containerRef.current?.appendChild(script);

    // 4) Опционально: чистим при анмаунте
    return () => {
      containerRef.current?.replaceChildren();
      delete window.onTelegramAuth;
    };
  }, []);

  // Просто пустой <div>, внутрь него React подгрузит <script>
  return <div>
    {!user && <div ref={containerRef}/>}
    {user && (
      <div style={{marginTop: '1rem'}}>
        <p>Привет, {user.first_name}!</p>
        {user.photo_url && (
          <img
            src={user.photo_url}
            alt="User avatar"
            width={320}
            height={320}
            style={{borderRadius: '50%'}}
          />
        )}
      </div>
    )}
  </div>;
};
