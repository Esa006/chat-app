import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EchoProvider } from './context/EchoContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChatLayout, ProtectedRoute } from './pages/ChatLayout';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EchoProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ChatLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:conversationId"
              element={
                <ProtectedRoute>
                  <ChatLayout />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </EchoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
