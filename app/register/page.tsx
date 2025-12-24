'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/user-api';
import RegisterForm from '@/app/components/organisms/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // 既にログイン済みの場合はリダイレクト
    const token = userApi.getToken();
    if (token) {
      router.push('/profile');
    }
  }, [router]);

  return <RegisterForm />;
}
