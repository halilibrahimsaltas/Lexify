import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import authService from "../services/auth.service";
import { StoredUserData } from "../services/storage.service";

interface AuthContextType {
  user: StoredUserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: StoredUserData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<StoredUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      // Storage'dan auth durumunu kontrol et
      const isLoggedIn = await authService.isLoggedIn();
      if (isLoggedIn) {
        const storedUser = await authService.getStoredUserData();
        if (storedUser) {
          // Token'ı API'ye restore et
          const tokenRestored = await authService.restoreAuthToken();
          if (tokenRestored) {
            setUser(storedUser);
          } else {
            // Token restore başarısızsa storage'ı temizle
            await authService.logout();
          }
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      // Hata durumunda storage'ı temizle
      try {
        await authService.logout();
      } catch (logoutError) {
        console.error("Logout error during initialization:", logoutError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    await authService.register({ email, password, name });
    // Oturum açma işlemi burada yapılmaz!
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Hata olsa bile local state'i temizle
      setUser(null);
    }
  };

  const updateUser = (userData: StoredUserData) => {
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
