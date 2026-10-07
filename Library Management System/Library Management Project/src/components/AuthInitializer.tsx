import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useNavigate } from 'react-router-dom';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const lastVisitedPage = useUIStore((state) => state.lastVisitedPage);
  const navigate = useNavigate();

  useEffect(() => {
    initializeAuth().then((success) => {
        if (success) {
          const authPages = ['/login', '/register'];
          const destination = authPages.includes(lastVisitedPage) ? '/' : lastVisitedPage;
          navigate(destination, {replace: true});
        }
    }).finally(() => {
      setIsInitializing(false);
    });
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
