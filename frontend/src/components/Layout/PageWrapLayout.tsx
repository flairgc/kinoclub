import React from 'react';
import { Header } from '../Header.tsx';

interface Props {
  children: React.ReactNode,
  title: string,
}

export const PageWrapLayout = ({children, title}: Props) => {
  return (
    <>
          <Header title={title}/>
          {children}
    </>
  );
}
