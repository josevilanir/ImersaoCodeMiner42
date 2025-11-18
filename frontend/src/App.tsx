import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;