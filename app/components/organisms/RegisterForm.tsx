'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userApi } from '@/lib/user-api';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import Card from '../molecules/Card';

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  const [loading, setLoading] = useState<{ echo: boolean; laravel: boolean }>({
    echo: false,
    laravel: false,
  });

  const validateForm = () => {
    const errors: typeof fieldErrors = {};

    if (!email) {
      errors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = '有効なメールアドレスを入力してください';
    }

    if (!password) {
      errors.password = 'パスワードは必須です';
    } else if (password.length < 8) {
      errors.password = 'パスワードは最低8文字必要です';
    }

    if (!name) {
      errors.name = '名前は必須です';
    } else if (name.length > 255) {
      errors.name = '名前は255文字以内で入力してください';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (apiType: 'echo' | 'laravel') => {
    setError('');
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading((prev) => ({ ...prev, [apiType]: true }));

    try {
      await userApi.register({ email, password, name }, apiType);
      router.push('/profile');
    } catch (err) {
      if (err instanceof Error) {
        setError(`${apiType === 'echo' ? 'Echo' : 'Laravel'} API: ${err.message}`);
      } else {
        setError(`${apiType === 'echo' ? 'Echo' : 'Laravel'} API: 登録に失敗しました`);
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
            新規登録
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
              error={fieldErrors.email}
            />
            <FormField
              label="パスワード"
              type="password"
              autoComplete="new-password"
              required
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
            <FormField
              label="お名前"
              type="text"
              autoComplete="name"
              required
              maxLength={255}
              placeholder="お名前"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name}
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
              Echo APIで登録
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              loading={loading.laravel}
              disabled={loading.echo || loading.laravel}
              onClick={() => handleSubmit('laravel')}
            >
              Laravel APIで登録
            </Button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              既にアカウントをお持ちの方はこちら
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
