'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, type Profile } from '@/lib/user-api';
import FormField from '../molecules/FormField';
import Label from '../atoms/Label';
import Textarea from '../atoms/Textarea';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Alert from '../atoms/Alert';
import Card from '../molecules/Card';

export default function ProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile(),
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name?: string; bio?: string; avatar?: string }) =>
      userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSuccess('プロフィールを更新しました');
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (err: Error) => {
      setError(err.message || 'プロフィールの更新に失敗しました');
      setSuccess('');
    },
  });

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setBio(profile.bio || '');
      setAvatar(profile.avatar || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('名前は必須です');
      return;
    }

    if (name.length > 255) {
      setError('名前は255文字以内で入力してください');
      return;
    }

    updateMutation.mutate({
      name: name.trim(),
      bio: bio.trim() || undefined,
      avatar: avatar.trim() || undefined,
    });
  };

  const handleLogout = async () => {
    if (confirm('ログアウトしますか？')) {
      await userApi.logout();
      router.push('/');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/default-avatar.png';
    target.onerror = null;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">プロフィール</h1>

      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      {success && <Alert type="success" className="mb-4">{success}</Alert>}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="ユーザー名"
            type="text"
            required
            maxLength={255}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div>
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              readOnly
              className="bg-gray-100 text-gray-600"
              value={email}
            />
            <p className="mt-1 text-sm text-gray-500">
              メールアドレスは変更できません
            </p>
          </div>

          <div>
            <Label htmlFor="bio">自己紹介</Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="自己紹介を入力してください"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="avatar">アバター画像URL</Label>
            <Input
              id="avatar"
              type="url"
              placeholder="アバター画像のURL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            {avatar && (
              <div className="mt-2">
                <img
                  src={avatar}
                  alt="アバタープレビュー"
                  className="max-w-[200px] max-h-[200px] rounded"
                  onError={handleImageError}
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              loading={updateMutation.isPending}
              disabled={updateMutation.isPending}
            >
              保存
            </Button>
            <Button type="button" variant="secondary" onClick={handleLogout}>
              ログアウト
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
