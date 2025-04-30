import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from "@heroui/system";
import { Router } from 'wouter';

import App from './App.tsx';
import "./styles/globals.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <HeroUIProvider className={"contents"}>
        <App />
      </HeroUIProvider>
    </Router>
  </StrictMode>
);
