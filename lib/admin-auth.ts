// Admin authentication and authorization utilities
export class AdminAuth {
  private static instance: AdminAuth;
  private isAuthenticated: boolean = false;
  private userRole: string = 'admin';

  private constructor() {}

  static getInstance(): AdminAuth {
    if (!AdminAuth.instance) {
      AdminAuth.instance = new AdminAuth();
    }
    return AdminAuth.instance;
  }

  login(email: string, password: string): boolean {
    // Simple mock authentication - in real app, this would validate against backend
    if (email === 'admin@pasalku.ai' && password === 'admin123') {
      this.isAuthenticated = true;
      this.userRole = 'admin';
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.userRole = 'guest';
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getUserRole(): string {
    return this.userRole;
  }

  hasPermission(permission: string): boolean {
    if (!this.isAuthenticated) return false;

    // Simple permission check - in real app, this would be more sophisticated
    const rolePermissions: { [key: string]: string[] } = {
      admin: ['READ_AI_LOGS', 'WRITE_AI_LOGS', 'DELETE_AI_LOGS', 'MANAGE_USERS'],
      moderator: ['READ_AI_LOGS', 'WRITE_AI_LOGS'],
      viewer: ['READ_AI_LOGS']
    };

    return rolePermissions[this.userRole]?.includes(permission) || false;
  }
}

export const PERMISSIONS = {
  READ_AI_LOGS: 'READ_AI_LOGS',
  WRITE_AI_LOGS: 'WRITE_AI_LOGS',
  DELETE_AI_LOGS: 'DELETE_AI_LOGS',
  MANAGE_USERS: 'MANAGE_USERS'
} as const;