class AuthService {
    // Mock login function
    login(username: string, password: string): Promise<boolean> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(!!(username && password)); // Allow any credentials for now
        }, 1000);
      });
    }
  }
  
  export default new AuthService();
  