import { Button, Input } from "@heroui/react";
import { Link } from "wouter";
import { ThirdPartyAuth } from "./ThirdPartyAuth.tsx";

export const Register = () => {
  return (
    <>
      <span className="text-xl mb-2">Регистрация</span>
      <Input className="max-w-xs" variant="bordered" label="Логин"
             labelPlacement="outside"
             placeholder="Введите логин" />
      <Input
        className="max-w-xs"
        variant="bordered"
        type="password"
        label="Пароль"
        labelPlacement="outside"
        placeholder="Введите пароль"
      />
      <Input
        className="max-w-xs"
        variant="bordered"
        type="password"
        label="Подтвердите пароль"
        labelPlacement="outside"
        placeholder="Подтвердите пароль"
      />
      <Input
        className="max-w-xs"
        variant="bordered"
        type="email"
        label="Email"
        labelPlacement="outside"
        placeholder="Введите email"
      />
      <Input
        className="max-w-xs"
        variant="bordered"
        label="Имя"
        labelPlacement="outside"
        placeholder="Введите имя"
      />
      <Button color="primary" className="min-h-10">Создать аккаунт</Button>

      <ThirdPartyAuth />

      <span className="text-center text-small">
        Уже есть аккаунт?{" "}
        <Link to="/login" className="text-primary">
          Войти
        </Link>
      </span>
    </>
  );
};
