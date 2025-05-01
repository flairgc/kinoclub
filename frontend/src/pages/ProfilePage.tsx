import { Button, User } from '@heroui/react';
import { useUser } from '../App.tsx';
import { logoutApi } from '../services/auth-service.ts';

export const ProfilePage = () => {

  const { user } = useUser();




  return (
    <div className="p-6 flex flex-col gap-6">
      <div>ProfilePage</div>

      {user && (
        <div className="flex justify-center">
          <User
            avatarProps={{
              src: user.avatarUrl || '',
              size: 'lg',
            }}
            description={user.login}
            name={user.name}
          />
        </div>
      )}

      <div className="whitespace-pre-wrap w-80 overflow-x-scroll">
        {JSON.stringify(user, null, 2)}
      </div>

      <Button color="danger" onPress={() => logoutApi().then(() => location.reload())}>Выйти</Button>
    </div>
  );
};
