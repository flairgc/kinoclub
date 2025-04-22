import { useEffect, useState } from 'react';
import AuthForm from './components/Auth/AuthForm';
import styles from './components/Auth/AuthForm.module.css';
import Button from './components/Button/Button.tsx';
import { getCurrentUser, logout } from './components/services/endpoints.ts';

function App() {

  const [needLogin, setNeedLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState<{login: string, name?: string} | null>(null);

  useEffect(() => {
    if (!needLogin) {
      getCurrentUser().then((data) => {
        setCurrentUser(data);
      }).catch((err) => {
        console.log('err', err.message);
        if (err.message === 'Unauthorized') {
          setNeedLogin(true);
        }
      })
    }
  }, [needLogin]);

  const handleLogout = () => {
    logout().then(() => setNeedLogin(true))
  }

  return (
    <div>
      {needLogin
        ? (<AuthForm onLogin={() => setNeedLogin(false)} />)
        : (<div className={styles.container}>
            <div className={styles.formCard}>
              <div className={styles.welcomeMessage}>
                  <h2 className={styles.title}>Привет, {currentUser?.login}!</h2>

                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    Выйти
                  </Button>
              </div>
            </div>
          </div>)}


    </div>
  );
}

export default App;
