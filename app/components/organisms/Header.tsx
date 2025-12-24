'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { userApi } from '@/lib/user-api';
import Button from '../atoms/Button';

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = userApi.getToken();
    setIsAuthenticated(!!token);

    if (token) {
      userApi
        .getCurrentUser()
        .then((user) => {
          setUserName(user.name);
        })
        .catch(() => {
          // エラー時は何もしない
        });
    }
  }, []);

  const handleLogout = async () => {
    if (confirm('ログアウトしますか？')) {
      await userApi.logout();
      setIsAuthenticated(false);
      setUserName(null);
      router.push('/');
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Compare System
          </Link>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {userName && (
                  <span className="text-gray-700">こんにちは、{userName}さん</span>
                )}
                <Link
                  href="/profile"
                  className="text-blue-600 hover:text-blue-800"
                >
                  プロフィール
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  ログアウト
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800"
                >
                  ログイン
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    登録
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
