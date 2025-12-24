'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userApi } from '@/lib/user-api';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import Card from '../molecules/Card';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<{ echo: boolean; laravel: boolean }>({
    echo: false,
    laravel: false,
  });

  const handleSubmit = async (apiType: 'echo' | 'laravel') => {
    setError('');
    setLoading((prev) => ({ ...prev, [apiType]: true }));

    try {
      await userApi.login({ email, password }, apiType);
      router.push('/profile');
    } catch (err) {
      if (err instanceof Error) {
        setError(`${apiType === 'echo' ? 'Echo' : 'Laravel'} API: ${err.message}`);
      } else {
        setError(`${apiType === 'echo' ? 'Echo' : 'Laravel'} API: ログインに失敗しました`);
      }
    } finally {
      setLoading((prev) => ({ ...prev, [apiType]: false }));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {error && <Alert type="error">{error}</Alert>}
          
          <div className="space-y-4">
            <FormField
              label="メールアドレス"
              type="email"
              autoComplete="email"
              required
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormField
              label="パスワード"
              type="password"
              autoComplete="current-password"
              required
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="primary"
              className="w-full"
              loading={loading.echo}
              disabled={loading.echo || loading.laravel}
              onClick={() => handleSubmit('echo')}
            >
              Echo APIでログイン
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              loading={loading.laravel}
              disabled={loading.echo || loading.laravel}
              onClick={() => handleSubmit('laravel')}
            >
              Laravel APIでログイン
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-800"
            >
              アカウントをお持ちでない方はこちら
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
