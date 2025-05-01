import { Button, Input } from "@heroui/react";
import { useState } from 'react';
import { Link } from "wouter";
import { loginApi } from '../../services/auth-service.ts';
import { ThirdPartyAuth } from "./ThirdPartyAuth.tsx";

export const Login = () => {
  // const [, navigate] = useLocation();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    loginApi({
      login, password
    }).then(() => {
      // пока жестко перегружаем, чтобы заново подтянуть инфу про пользователя, потом нужно будет обойти это, либо не обойти, так как еще нужно переадресатую сохранить как то
      // navigate('/')
      window.location.href = '/';
    })
  }

  return (
    <>
      <span className="text-xl mb-2">Войти</span>
      <Input
        className="max-w-xs"
        variant="bordered"
        labelPlacement="outside"
        label="Логин"
        placeholder="Введите логин"
        value={login}
        onValueChange={setLogin}
      />
      <Input
        className="max-w-xs"
        variant="bordered"
        labelPlacement="outside"
        type="password"
        label="Пароль"
        placeholder="Введите пароль"
        value={password}
        onValueChange={setPassword}
      />
      <Button color="primary" className="min-h-10" onPress={handleSubmit}>Войти</Button>

      <ThirdPartyAuth />

      <span className="text-center text-small">
        Нет аккаунта?{" "}
        <Link to="/register" className="text-primary">
          Создать
        </Link>
      </span>
    </>
  );
};
