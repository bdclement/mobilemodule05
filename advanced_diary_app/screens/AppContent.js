import { useSupabaseSession } from '../context/AuthContext';
import LoginPage from './Login';
import Home from '../navigation/Home';

export default function AppContent() {
  const { session } = useSupabaseSession();

  return session ? <Home /> : <LoginPage />;
}