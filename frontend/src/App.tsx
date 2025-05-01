// import MobileLayout from './components/Layout/MobileLayout';
import { Button } from '@heroui/react';
import { useTheme } from '@heroui/use-theme';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
// import { Layout as LayoutApp } from "./components/Layout/Layout.tsx";
import {
  Sun,
  Moon,
} from "react-feather";
import { Routes } from "./routes.tsx";
import { fetchCurrentUserApi } from './services/user-service.ts';





type User = {
  id: number,
  login: string,
  email: string,
  name: string,
  avatarUrl: string | null

}

type UserContextType = {
  user: User | null;
};

// Создаем сам контекст
export const UserContext = createContext<UserContextType | undefined>(undefined);


// Провайдер
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {


    const getCurrentUserApi = async () => {

      const data = await fetchCurrentUserApi();

      setUser(data.data.user)

    }

    getCurrentUserApi().then();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

// Хук для удобного использования контекста
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default function App() {

  return (
    <UserProvider>
      <Routes />
      <ThemeSwitcher />
      <DebbugLayout />
    </UserProvider>
  );
}



// ОТЛАДКА





function ThemeSwitcher() {

  const { theme, setTheme } = useTheme()

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 8,
          right: 8,
          zIndex: 9998,
        }}
      >
        {theme === 'light'
          ? <Button isIconOnly onPress={() => setTheme('dark')} size="sm"><Moon /></Button>
          : <Button isIconOnly onPress={() => setTheme('light')} size="sm"><Sun /></Button>
        }

      </div>
    </>
  );
}


function DebbugLayout({open = false}: { open?: boolean }) {
  // отладка

  const [windowSize, setWindowSize] = useState({
    innerHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    outerHeight: typeof window !== "undefined" ? window.outerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        innerHeight: window.innerHeight,
        outerHeight: window.outerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!open) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          backgroundColor: "white",
          border: "1px solid black",
          zIndex: 9998,
        }}
      >
        <div>innerHeight: {windowSize.innerHeight}</div>
        <div>outerHeight: {windowSize.outerHeight}</div>
      </div>
      <div
        style={{
          width: 4,
          height: windowSize.innerHeight - 10,
          position: "fixed",
          top: 0,
          right: 0,
          backgroundColor: "red",
          zIndex: 9999,
        }}
      ></div>
    </>
  );
}
