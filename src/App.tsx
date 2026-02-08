import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicBooking from './components/public/PublicBooking';
import Index from './pages/Index';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import PatientPortal from './pages/PatientPortal';
import LoginPage from './pages/LoginPage';
import DoctorDashboard from './pages/DoctorDashboard';
import RegisterDoctorPage from './pages/RegisterDoctorPage';
import RegisterPage from './pages/Register';
import NotFound from './pages/NotFound';
import PublicHome from './components/public/PublicHome';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="medical" storageKey="medical-ui-theme">
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/new-home" element={<PublicHome />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/medicos-dashboard" element={<DoctorDashboardPage />} />
            <Route path="/medicos-dashboard" element={<DoctorDashboardPage />} />
            <Route path="/reservar" element={<PublicBooking />} />
            <Route path="/portal-pacientes" element={<PatientPortal />} />
            <Route path="/register-doctor" element={<RegisterDoctorPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;