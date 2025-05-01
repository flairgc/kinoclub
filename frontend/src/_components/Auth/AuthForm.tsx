import React, { useState } from "react";
import { TelegramLogin } from "../../TelegramLoginButton.tsx";
import Input from "../Input/Input";
import Button from "../Button/Button";
import {
  hello,
  login,
  loginByTelegram,
  register,
  TelegramLoginData,
} from "../services/endpoints.ts";
import styles from "./AuthForm.module.css";

interface FormValues {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  name?: string;
}

type Props = {
  onLogin: () => void;
};

const AuthForm = ({ onLogin }: Props) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [values, setValues] = useState<FormValues>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (!isLogin && (name === "password" || name === "confirmPassword")) {
      // const otherField = name === 'password' ? 'confirmPassword' : 'password';
      const otherValue =
        name === "password" ? values.confirmPassword : values.password;

      if (value && otherValue && value !== otherValue) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Пароли не совпадают",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: undefined,
        }));
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!values.username.trim()) {
      newErrors.username = "Требуется ввести логин";
    }

    if (!values.password) {
      newErrors.password = "Требуется ввести пароль";
    } else if (values.password.length < 6) {
      newErrors.password = "Пароль должен содержать как минимум 6 символов";
    }

    if (!isLogin) {
      if (!values.confirmPassword) {
        newErrors.confirmPassword = "Пожалуйста, подтвердите пароль";
      } else if (values.password !== values.confirmPassword) {
        newErrors.confirmPassword = "Пароль не совпадают";
      }

      if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
        newErrors.email = "Email не валидный";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    if (isLogin) {
      // login
      login({
        login: values.username,
        password: values.password,
      }).then((resp) => {
        console.log("login resp", resp);
        setIsSubmitting(false);

        onLogin();
      });
    } else {
      // register
      register({
        login: values.username,
        password: values.password,
        name: values.name,
        email: values.email,
      }).then((resp) => {
        console.log("register resp", resp);
        setIsSubmitting(false);

        onLogin();
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setValues({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      name: "",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Input
              id="username"
              name="username"
              label="Логин"
              placeholder="Введите логин"
              value={values.username}
              onChange={handleChange}
              required
              error={errors.username}
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              id="password"
              name="password"
              type="password"
              label="Пароль"
              placeholder="Введите пароль"
              value={values.password}
              onChange={handleChange}
              required
              error={errors.password}
            />
          </div>

          {!isLogin && (
            <>
              <div className={styles.inputGroup}>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Подтвердите пароль"
                  placeholder="Подтвердите пароль"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  required
                  error={errors.confirmPassword}
                />
              </div>

              <div className={styles.inputGroup}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Введите еmail (опционально)"
                  placeholder="Email"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>

              <div className={styles.inputGroup}>
                <Input
                  id="name"
                  name="name"
                  label="Введите имя (опционально)"
                  placeholder="Имя"
                  value={values.name}
                  onChange={handleChange}
                  error={errors.name}
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "В процессе..."
              : isLogin
                ? "Войти"
                : "Зарегистрировать"}
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}
            <Button
              variant="text"
              onClick={toggleAuthMode}
              className={styles.toggleButton}
            >
              {isLogin ? "Зарегистрировать" : "Войти"}
            </Button>
          </p>
        </div>

        <br></br>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <TelegramLogin
            dataOnauth={(userData: TelegramLoginData) => {
              console.info("user", userData);
              loginByTelegram(userData).then(onLogin);
            }}
          />
        </div>

        <div className={styles.footer}>
          <p>
            <Button
              variant="text"
              onClick={() => {
                hello().then((resp) => {
                  alert(JSON.stringify(resp));
                });
              }}
              className={styles.toggleButton}
            >
              Test Hello
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
