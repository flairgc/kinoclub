import { Route, Switch, useLocation } from "wouter";
import { PageWrapLayout } from "./components/Layout/PageWrapLayout.tsx";
import { AuthPage } from './pages/AuthPage.tsx';
import { LibraryPage } from "./pages/LibraryPage.tsx";
import { ClubPage } from "./pages/ClubPage.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { UserProvider } from './providers/UserProvider.tsx';

const publicRoutes = ['/login', '/register'];

export const Routes = () => {
  const [location] = useLocation();

  if (publicRoutes.includes(location)) {
    return (
      <Switch>
        <Route path="/login" component={AuthPage} />
        <Route path="/register" component={AuthPage} />
      </Switch>
    );
  }

  return (
    <UserProvider fallback={<>Загрузка...</>}>
      <Switch>
        <Route path="/">
          <PageWrapLayout title="Кинотека">
            <LibraryPage />
          </PageWrapLayout>
        </Route>
        <Route path="/club">
          <PageWrapLayout title="Кино Клуб">
            <ClubPage />
          </PageWrapLayout>
        </Route>
        <Route path="/session">
          <PageWrapLayout title="Сессия">
            <ClubPage />
          </PageWrapLayout>
        </Route>
        <Route path="/profile">
          <PageWrapLayout title="Профиль">
            <ProfilePage />
          </PageWrapLayout>
        </Route>
        <Route path="/login" component={AuthPage} />
        <Route path="/register" component={AuthPage} />
      </Switch>
    </UserProvider>
  );
};
