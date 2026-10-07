import { useEffect, useState } from 'react';
import { silentRefresh } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useNavigate } from 'react-router-dom';

interface AuthInitializerProps {
  children: React.ReactNode;
}

const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const lastVisitedPage = useUIStore((state) => state.lastVisitedPage);
  const navigate = useNavigate();

  useEffect(() => {
    silentRefresh().then((success) => {
        if (success) {
            navigate(lastVisitedPage, {replace: true});
        }
    }).finally(() => {
      setIsInitializing(false);
    });
  }, [lastVisitedPage, navigate]);

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
