import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {fetchCurrentUserApi} from '../services/user-service.ts';


type User = {
  id: number;
  login: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

type UserContextType = {
  user: User | null;
};

// Создаем сам контекст
export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

// Провайдер
export const UserProvider = ({ children, fallback }: { children: ReactNode, fallback: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getCurrentUserApi = async () => {
      const data = await fetchCurrentUserApi();

      setUser(data.data.user);
    };

    void getCurrentUserApi();
  }, []);

  if (!user) return <>{fallback}</>;

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

// Хук для удобного использования контекста
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider.tsx");
  }
  return context;
};