import { useEffect, useState } from 'react';
import AuthForm from './components/Auth/AuthForm';
import styles from './components/Auth/AuthForm.module.css';
import Button from './components/Button/Button.tsx';
import { getCurrentUser, logout } from './components/services/endpoints.ts';


const stringToColor = (str: string): string => {
  let hash = 0;

  // Простейшее хеш-подобное преобразование строки
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Преобразуем в 32-битное целое
  }

  // Преобразуем hash в значение hue от 0 до 359
  const hue = Math.abs(hash) % 360;

  // Максимальная насыщенность и средняя яркость — яркий цвет
  return `hsl(${hue}, 100%, 50%)`;
};


function App() {

  const [needLogin, setNeedLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState<{login: string, name?: string} | null>(null);

  useEffect(() => {
    if (!needLogin) {
      getCurrentUser().then((data) => {
        setCurrentUser(data.user);
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
                <h2 className={styles.title}>Привет, <span style={{color: stringToColor(currentUser?.login || '')}}>{currentUser?.login}</span>!</h2>

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
