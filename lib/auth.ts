// Sementara file auth sederhana untuk development
// TODO: Ganti dengan implementasi autentikasi yang sebenarnya

export async function auth() {
  // Simulasi user yang sudah login
  return {
    user: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com'
    }
  };
}
