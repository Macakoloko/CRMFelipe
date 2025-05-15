import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Calendar from "./pages/Calendar";
import Clients from "./pages/Clients";
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import Prospecting from "./pages/Prospecting";
import Contact from "./pages/prospecting/Contact";
import Documents from "./pages/prospecting/Documents";
import ROICalculator from "./pages/prospecting/ROICalculator";
import Templates from "./pages/prospecting/Templates";
import LeadAcompanhamento from "./pages/prospecting/LeadAcompanhamento";
import { NotificationsProvider } from "./lib/NotificationsContext";
import { ChatProvider } from "./lib/ChatContext";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { ThemeProvider } from "./lib/ThemeContext";
import { LanguageProvider } from "./lib/LanguageContext";
import { LanguageSelector } from "./components/LanguageSelector";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notifications from "./components/Notifications";
import Leads from "./pages/Leads";
import Settings from "./pages/Settings";
import { LeadProvider } from "./contexts/LeadContext";

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationsProvider>
            <ChatProvider>
              <LeadProvider>
                <TooltipProvider>
                  <Sonner />
                  <Notifications />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      {/* Protected Routes */}
                      <Route
                        path="/*"
                        element={
                          <ProtectedRoute>
                            <div className="flex h-screen">
                              <Sidebar />
                              <main className="flex-1 overflow-y-auto bg-background flex flex-col">
                                <header className="h-14 border-b border-border/80 flex items-center justify-end px-4">
                                  <LanguageSelector />
                                </header>
                                <div className="flex-1">
                                  <Routes>
                                    <Route path="/" element={<Index />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/tasks" element={<Tasks />} />
                                    <Route path="/projects" element={<Projects />} />
                                    <Route path="/calendar" element={<Calendar />} />
                                    <Route path="/clients" element={<Clients />} />
                                    <Route path="/chat" element={<Chat />} />
                                    <Route path="/prospecting" element={<Prospecting />} />
                                    <Route path="/prospecting/contact" element={<Contact />} />
                                    <Route path="/prospecting/documents" element={<Documents />} />
                                    <Route path="/prospecting/roi-calculator" element={<ROICalculator />} />
                                    <Route path="/prospecting/templates" element={<Templates />} />
                                    <Route path="/prospecting/lead-acompanhamento" element={<LeadAcompanhamento />} />
                                    <Route path="/leads" element={<Leads />} />
                                    <Route path="/settings" element={<Settings />} />
                                    <Route path="*" element={<NotFound />} />
                                  </Routes>
                                </div>
                              </main>
                            </div>
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </LeadProvider>
            </ChatProvider>
          </NotificationsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
