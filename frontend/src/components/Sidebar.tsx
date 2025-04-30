import { Link } from 'wouter';
import { Bookmark, Users, Settings } from 'react-feather';

export const Sidebar = () => {
  return (
    <div className="w-64 border-r bg-white p-4">
      <div className="flex flex-col items-center">
        <img alt="logo" src="/kc-logo.png" className="w-36 h-36" />
      </div>

      <nav className="flex flex-col space-y-2 mt-2">
        <Link href="/" className="flex gap-2 px-4 py-2 hover:bg-gray-100 rounded"><Bookmark />Кинотека</Link>
        <Link href="/club" className="flex gap-2 px-4 py-2 hover:bg-gray-100 rounded"><Users />Клубы</Link>
        <Link href="/profile" className="flex gap-2 px-4 py-2 hover:bg-gray-100 rounded"><Settings />Профиль</Link>
      </nav>
    </div>
  );
}
