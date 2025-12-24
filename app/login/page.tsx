'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/user-api';
import LoginForm from '@/app/components/organisms/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // 既にログイン済みの場合はリダイレクト
    const token = userApi.getToken();
    if (token) {
      router.push('/profile');
    }
  }, [router]);

  return <LoginForm />;
}
