import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from '../lib/auth';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      setLoading(false);
      if (!session) {
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg">{loading ? 'Checking authentication...' : 'Redirecting...'}</div>
    </div>
  );
}
