import { User } from '@heroui/react';
import { Link } from "wouter";
import { Bookmark, Users, Settings } from "react-feather";
// импортировать из апа плохо, потом вынесу консектс в отдельный файл
import { useUser } from '../App.tsx';

export const Sidebar = () => {

  const { user } = useUser();


  return (
    <div className="w-64 border-r p-4">
      <div className="flex flex-col items-center">
        <img alt="logo" src="/kc-logo.png" className="w-36 h-36 bg-white rounded" />
      </div>

      {user && (
        <div className="flex justify-center mt-2">
          <User
            avatarProps={{
              src: user.avatarUrl || '',
            }}
            description={user.login}
            name={user.name}
          />
        </div>
      )}

      <nav className="flex flex-col space-y-2 mt-2">
        <Link
          href="/"
          className="flex gap-2 px-4 py-2 hover:bg-gray-100 rounded"
        >
          <Bookmark />
          Кинотека
        </Link>
        <Link
          href="/club"
          className="flex gap-2 px-4 py-2 hover:bg-gray-100 rounded"
        >
          <Users />
          Клубы
        </Link>
        <Link
          href="/profile"
          className="flex gap-2 px-4 py-2 hover:bg-gray-100 rounded"
        >
          <Settings />
          Профиль
        </Link>
      </nav>
    </div>
  );
};
