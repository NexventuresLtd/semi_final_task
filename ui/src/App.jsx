import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import { useNotificationSocket } from "./hooks/useNotificationSocket";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

// Small inner component whose only job is to sit INSIDE QueryClientProvider,
// so any hook here (like useNotificationSocket, which needs useQueryClient)
// actually has access to the query client. Nothing in App() itself is
// wrapped by the provider it creates — only its children are.
function AppContent() {
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const initTheme = useThemeStore((s) => s.initTheme);

  useNotificationSocket();

  useEffect(() => {
    initTheme();
    fetchSession();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
}