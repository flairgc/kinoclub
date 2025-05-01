import { useRoute } from "wouter";
import { Login } from "../components/Auth/Login.tsx";
import { Card, CardBody } from "@heroui/react";
import { Register } from '../components/Auth/Register.tsx';

export const AuthPage = () => {
  const [isRegister] = useRoute("/register");

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-purple-600">
      <Card className="min-w-[20rem] sm:min-w-[24rem]">
        <CardBody className="p-8 flex flex-col gap-4 overflow-auto">
          {isRegister ? <Register/> : <Login />}
        </CardBody>
      </Card>
    </div>
  );
};
