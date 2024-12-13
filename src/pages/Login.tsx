import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEmployeeStore } from '../store/employeeStore';
import Input from '../components/Input';
import Button from '../components/Button';

const loginSchema = z.object({
  username: z.string().min(1, 'Kullanıcı adı gereklidir'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useEmployeeStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    const user = login(data.username, data.password);
    if (user) {
      navigate('/', { replace: true });
    } else {
      setError('root', {
        message: 'Kullanıcı adı veya şifre hatalı',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Personel Takip Sistemi
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Kullanıcı Adı"
              {...register('username')}
              error={errors.username?.message}
            />
            <Input
              label="Şifre"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>
          {errors.root && (
            <p className="text-sm text-red-600 text-center">{errors.root.message}</p>
          )}
          <Button type="submit" className="w-full">
            Giriş Yap
          </Button>
        </form>
      </div>
    </div>
  );
}