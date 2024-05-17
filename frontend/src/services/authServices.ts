import Cookies from 'js-cookie';

interface LoginResponse {
  success: boolean;
  error?: string;
}

const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok && data.success) {
      Cookies.set('token', data.token, { expires: 7, path: '/' });
      return { success: true };
    } else {
      return { success: false, error: data.message || 'Failed to login' };
    }
  } catch (err) {
    console.error('Login error:', err);
    return { success: false, error: (err as string) || 'Failed to login' };
  }
};

export default login;
