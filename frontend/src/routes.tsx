import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Home } from './pages/Home';
import { CreateRoom } from './pages/CreateRoom';
import { JoinRoom } from './pages/JoinRoom';
import { Room } from './pages/Room';

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route
          path="/room/:code"
          element={
            <PrivateRoute>
              <Room />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}