import { Route, Switch } from 'wouter';
import { PageWrapLayout } from './components/Layout/PageWrapLayout.tsx';
import { LibraryPage } from './pages/LibraryPage.tsx';
import { ClubPage } from './pages/ClubPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';

export const Routes = () => {
  return (
    <Switch>
      <Route path="/">
        <PageWrapLayout title="Кинотека"><LibraryPage/></PageWrapLayout>
      </Route>
      <Route path="/club">
        <PageWrapLayout title="Кино Клуб"><ClubPage/></PageWrapLayout>
      </Route>
      <Route path="/session">
        <PageWrapLayout title="Сессия"><ClubPage/></PageWrapLayout>
      </Route>
      <Route path="/profile">
        <PageWrapLayout title="Профиль"><ProfilePage/></PageWrapLayout>
      </Route>
    </Switch>
  );
}
