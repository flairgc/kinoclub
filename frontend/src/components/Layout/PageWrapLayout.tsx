import React from "react";
import { Header } from "./Header.tsx";
import { Layout } from './Layout.tsx';

interface Props {
  children: React.ReactNode;
  title: string;
}

export const PageWrapLayout = ({ children, title }: Props) => {
  return (
    <Layout>
      <Header title={title} />
      {children}
    </Layout>
  );
};
