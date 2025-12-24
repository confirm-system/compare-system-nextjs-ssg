/**
 * 一般ユーザー向けAPIクライアント
 */

const API_ECHO_URL = process.env.NEXT_PUBLIC_API_ECHO_URL || 'http://localhost/api/echo';
const API_LARAVEL_URL = process.env.NEXT_PUBLIC_API_LARAVEL_URL || 'http://localhost/api/laravel';

export type ApiType = 'echo' | 'laravel';

const getApiUrl = (apiType: ApiType = 'echo') => {
  if (apiType === 'laravel') {
    return `${API_LARAVEL_URL}/users`;
  }
  return `${API_ECHO_URL}/users`;
};

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export interface Profile {
  id: number;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatar?: string;
}

class UserApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'UserApiError';
  }
}

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_token');
};

const getApiType = (): ApiType => {
  if (typeof window === 'undefined') return 'echo';
  return (localStorage.getItem('user_api_type') as ApiType) || 'echo';
};

const setToken = (token: string, apiType: ApiType = 'echo'): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user_token', token);
  localStorage.setItem('user_api_type', apiType);
};

const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_api_type');
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = 'エラーが発生しました';
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // JSON解析に失敗した場合はデフォルトメッセージを使用
    }

    if (response.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    throw new UserApiError(errorMessage, response.status);
  }

  return response.json();
};

const fetchWithAuth = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return handleResponse<T>(response);
};

export const userApi = {
  /**
   * ユーザー登録
   */
  register: async (data: RegisterRequest, apiType: ApiType = 'echo'): Promise<LoginResponse> => {
    const response = await fetchWithAuth<LoginResponse>(
      `${getApiUrl(apiType)}/register`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    setToken(response.token, apiType);
    return response;
  },

  /**
   * ログイン
   */
  login: async (data: LoginRequest, apiType: ApiType = 'echo'): Promise<LoginResponse> => {
    const response = await fetchWithAuth<LoginResponse>(
      `${getApiUrl(apiType)}/login`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    setToken(response.token, apiType);
    return response;
  },

  /**
   * ログアウト
   */
  logout: async (): Promise<void> => {
    const apiType = getApiType();
    try {
      await fetchWithAuth(`${getApiUrl(apiType)}/logout`, {
        method: 'POST',
      });
    } catch (error) {
      // エラーが発生してもトークンは削除する
      console.error('Logout error:', error);
    } finally {
      removeToken();
    }
  },

  /**
   * プロフィール取得
   */
  getProfile: async (): Promise<Profile> => {
    const apiType = getApiType();
    return fetchWithAuth<Profile>(`${getApiUrl(apiType)}/profile`, {
      method: 'GET',
    });
  },

  /**
   * プロフィール更新
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<Profile> => {
    const apiType = getApiType();
    return fetchWithAuth<Profile>(`${getApiUrl(apiType)}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * 現在のユーザー情報取得（プロフィールと同じ）
   */
  getCurrentUser: async (): Promise<Profile> => {
    return userApi.getProfile();
  },

  /**
   * トークン取得
   */
  getToken,

  /**
   * トークン削除
   */
  removeToken,
};
