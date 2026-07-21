import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store/authStore";
import { useThemeStore } from "./store/themeStore";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min — pairs with backend caching layer
      retry: 1,
    },
  },
});

export default function App() {
  const fetchSession = useAuthStore((s) => s.fetchSession);
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
    fetchSession(); // restores session via refresh cookie on page load
  }, []);

  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppRoutes />
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </BrowserRouter>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
}