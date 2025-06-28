// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Dictionary: undefined;
  Translation: undefined;
  Profile: undefined;
  Books: undefined;
  AddBook: undefined;
  BookDetail: { bookId: number };
};

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Book Types
export interface Book {
  id: number;
  title: string;
  content: string;
  author: string;
  coverImage?: string;
  filePath: string;
  category: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  title: string;
  content: string;
  author: string;
  coverImage?: string;
  filePath: string;
  category: string;
}

// App State Types
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
} 