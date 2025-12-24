import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ようこそ Compare System へ
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            このアプリケーションは、Next.jsとNuxt.jsの比較プロジェクトです。
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              アプリの説明
            </h2>
            <p className="text-gray-700 mb-4">
              Compare Systemは、異なるWebフレームワークの実装を比較するためのプロジェクトです。
              一般ユーザー向けの機能として、ユーザー登録、ログイン、プロフィール管理が利用できます。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              主な機能
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>ユーザー登録・ログイン機能</li>
              <li>プロフィール管理（名前、自己紹介、アバター画像）</li>
              <li>セキュアな認証システム</li>
              <li>レスポンシブデザイン</li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block mr-4"
            >
              新規登録
            </Link>
            <Link
              href="/login"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 inline-block"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
