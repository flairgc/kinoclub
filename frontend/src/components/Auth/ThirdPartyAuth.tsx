import { Button, Divider } from "@heroui/react";
import { loginByTelegramApi, TelegramLoginData } from '../../services/auth-service.ts';
import { TelegramLogin } from './TelegramLoginButton.tsx';

export const ThirdPartyAuth = () => {
  return (
    <>
      <div className="flex items-center gap-4 py-2">
        <Divider className="w-full flex-1" />
        <span className="shrink-0 text-tiny text-default-500">Или</span>
        <Divider className="w-full flex-1" />
      </div>
      <TelegramLogin
        dataOnauth={(userData: TelegramLoginData) => {
          console.info("user", userData);
          loginByTelegramApi(userData).then(() => {
            window.location.href = '/';
          });
        }}
      />
    </>
  );
};
