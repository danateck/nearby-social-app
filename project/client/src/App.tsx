import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout';
import HomePage from './pages/HomePage';
import NearbyPage from './pages/NearbyPage';
import FriendsPage from './pages/FriendsPage';
import ChatsPage from './pages/ChatsPage';
import GroupsPage from './pages/GroupsPage';
import type { ReactElement } from 'react';
import ChatRoomPage from './pages/ChatRoomPage';
function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="nearby" element={<NearbyPage />} />
        <Route path="friends" element={<FriendsPage />} />
        <Route path="chats" element={<ChatsPage />} />
        <Route path="groups" element={<GroupsPage />} />
        <Route path="/chats/:chatId" element={<ChatRoomPage />} />
      </Route>
    </Routes>
  );
}
