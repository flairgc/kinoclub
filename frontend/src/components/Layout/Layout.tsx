import { BottomNav } from '../BottomNav.tsx';
// import { Header } from '../Header.tsx';
import { Sidebar } from '../Sidebar.tsx';

interface Props {
  children: React.ReactNode
}

export const Layout = ({children}: Props) => {
  return (
    <div className="flex h-full flex-1">
      <div className="hidden md:flex w-64">
          <Sidebar/>
      </div>
      <div className="flex flex-1 flex-col h-full">
        {/*<div className="flex-none">*/}
        {/*  <Header/>*/}
        {/*</div>*/}
        <main className="flex flex-1 overflow-y-auto flex-col"
              // style={{height: 'calc(100% - 70px)'}}
          >
          {children}
        </main>
        <div
          className="md:hidden flex flex-none"
          // style={{height: 70}}
        >
          <BottomNav/>
        </div>
      </div>
    </div>
  );
}
