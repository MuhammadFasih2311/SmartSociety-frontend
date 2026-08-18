import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import { SettingsProvider } from './context/SettingsContext';

const PublicLayout = lazy(() => import('./components/layout/PublicLayout'));
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const ResidentSidebar = lazy(() => import('./components/layout/ResidentSidebar'));
const AdminSidebar = lazy(() => import('./components/layout/AdminSidebar'));
const GuardSidebar = lazy(() => import('./components/layout/GuardSidebar'));

const Home = lazy(() => import('./pages/Home'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ResidentManagement = lazy(() => import('./pages/admin/ResidentManagement'));
const GuardManagement = lazy(() => import('./pages/admin/GuardManagement'));
const Amenities = lazy(() => import('./pages/admin/Amenities')); 
const BillingEngine = lazy(() => import('./pages/admin/BillingEngine'));
const ComplaintRouting = lazy(() => import('./pages/admin/ComplaintRouting'));
const Notices = lazy(() => import('./pages/admin/Notices'));
const AdminAmenityBookings = lazy(() => import('./pages/admin/AmenityBookings'));
const SecurityLogs = lazy(() => import('./pages/admin/SecurityLogs'));
const Settings = lazy(() => import('./pages/admin/Settings'));

const CreateResident = lazy(() => import('./pages/admin/resident/CreateResident'));
const EditResident = lazy(() => import('./pages/admin/resident/EditResident'));
const ShowResident = lazy(() => import('./pages/admin/resident/ShowResident'));

const CreateGuard = lazy(() => import('./pages/admin/guard/CreateGuard'));
const EditGuard = lazy(() => import('./pages/admin/guard/EditGuard'));
const ShowGuard = lazy(() => import('./pages/admin/guard/ShowGuard'));

const GenerateBill = lazy(() => import('./pages/admin/billing/GenerateBill'));
const EditBill = lazy(() => import('./pages/admin/billing/EditBill'));
const ShowBill = lazy(() => import('./pages/admin/billing/ShowBill'));

const ShowLog = lazy(() => import('./pages/admin/security/ShowLog'));
const AddLog = lazy(() => import('./pages/admin/security/AddLog'));

const CreateNotice = lazy(() => import('./pages/admin/notices/CreateNotice'));
const EditNotice = lazy(() => import('./pages/admin/notices/EditNotice'));
const ShowNotice = lazy(() => import('./pages/admin/notices/ShowNotice'));

const CreateAmenity = lazy(() => import('./pages/admin/amenity/CreateAmenity'));
const EditAmenity = lazy(() => import('./pages/admin/amenity/EditAmenity'));
const ShowAmenity = lazy(() => import('./pages/admin/amenity/ShowAmenity'));

const GuardDashboard = lazy(() => import('./pages/guard/Dashboard'));
const Visitors = lazy(() => import('./pages/guard/Visitors'));
const PassVerification = lazy(() => import('./pages/guard/PassVerification'));
const GateLogs = lazy(() => import('./pages/guard/GateLogs'));
const Reports = lazy(() => import('./pages/guard/Reports'));
const GateStatus = lazy(() => import('./pages/guard/GateStatus'));
const GuardSettings = lazy(() => import('./pages/guard/Settings'));

const CreateVisitor = lazy(() => import('./pages/guard/visitors/CreateVisitor'));
const EditVisitor = lazy(() => import('./pages/guard/visitors/EditVisitor'));
const ShowVisitor = lazy(() => import('./pages/guard/visitors/ShowVisitor'));

const ResidentDashboard = lazy(() => import('./pages/resident/Dashboard'));
const ResidentProfile = lazy(() => import('./pages/resident/Profile'));
const ResidentSettings = lazy(() => import('./pages/resident/Settings'));
const VisitorPass = lazy(() => import('./pages/resident/VisitorPass'));
const ResidentAmenities = lazy(() => import('./pages/resident/Amenities')); 
const MaintenanceBills = lazy(() => import('./pages/resident/MaintenanceBills'));
const ResidentComplaints = lazy(() => import('./pages/resident/Complaints'));
const ResidentAmenityBooking = lazy(() => import('./pages/resident/AmenityBooking'));
const ResidentNotices = lazy(() => import('./pages/resident/Notices'));

const Root = () => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  
  return <Navigate to="/home" replace />;
};

const AppContent = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (!loading && isAuthenticated && user) {
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '/home' || currentPath === '/sitemap') {
      return <Navigate to={`/${user.role}/dashboard`} replace />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <ScrollToTop />
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/" element={<Root />} />

          <Route element={<PublicLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/sitemap" element={<Sitemap />} />
          </Route>

          <Route path="/resident/*" element={
            <ProtectedRoute allowedRoles={['resident']}>
              <DashboardLayout sidebar={<ResidentSidebar />}>
                <Routes>
                  <Route path="dashboard" element={<ResidentDashboard />} />
                  <Route path="profile" element={<ResidentProfile />} />
                  <Route path="settings" element={<ResidentSettings />} />
                  <Route path="amenities" element={<ResidentAmenities />} />
                  <Route path="visitor-pass" element={<VisitorPass />} />
                  <Route path="bills" element={<MaintenanceBills />} />
                  <Route path="complaints" element={<ResidentComplaints />} />
                  <Route path="booking" element={<ResidentAmenityBooking />} />
                  <Route path="notices" element={<ResidentNotices />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout sidebar={<AdminSidebar />}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="residents" element={<ResidentManagement />} />
                  <Route path="guards" element={<GuardManagement />} />
                  <Route path="amenities" element={<Amenities />} /> 
                  <Route path="amenities/create" element={<CreateAmenity />} />
                  <Route path="amenities/edit/:id" element={<EditAmenity />} />
                  <Route path="amenities/show/:id" element={<ShowAmenity />} />
                  <Route path="billing" element={<BillingEngine />} />
                  <Route path="amenities/bookings" element={<AdminAmenityBookings />} />
                  <Route path="complaints" element={<ComplaintRouting />} />
                  <Route path="notices" element={<Notices />} />
                  <Route path="security" element={<SecurityLogs />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="residents/create" element={<CreateResident />} />
                  <Route path="residents/edit/:id" element={<EditResident />} />
                  <Route path="residents/show/:id" element={<ShowResident />} />

                  <Route path="guards/create" element={<CreateGuard />} />
                  <Route path="guards/edit/:id" element={<EditGuard />} />
                  <Route path="guards/show/:id" element={<ShowGuard />} />

                  <Route path="billing/generate" element={<GenerateBill />} />
                  <Route path="billing/edit/:id" element={<EditBill />} />
                  <Route path="billing/show/:id" element={<ShowBill />} />

                  <Route path="security/show/:id" element={<ShowLog />} />
                  <Route path="security/add" element={<AddLog />} />

                  <Route path="notices/create" element={<CreateNotice />} />
                  <Route path="notices/edit/:id" element={<EditNotice />} />
                  <Route path="notices/show/:id" element={<ShowNotice />} />

                  <Route path="amenities/create" element={<CreateAmenity />} />
                  <Route path="amenities/edit/:id" element={<EditAmenity />} /> 
                  <Route path="amenities/show/:id" element={<ShowAmenity />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/guard/*" element={
            <ProtectedRoute allowedRoles={['guard']}>
              <DashboardLayout sidebar={<GuardSidebar />}>
                <Routes>
                  <Route path="dashboard" element={<GuardDashboard />} />
                  <Route path="visitors" element={<Visitors />} />
                  <Route path="verify" element={<PassVerification />} />
                  <Route path="logs" element={<GateLogs />} />
                  <Route path="report" element={<Reports />} />
                  <Route path="gates" element={<GateStatus />} />
                  <Route path="settings" element={<GuardSettings />} />

                  <Route path="visitor/create" element={<CreateVisitor />} />
                  <Route path="visitor/edit/:id" element={<EditVisitor />} />
                  <Route path="visitor/show/:id" element={<ShowVisitor />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </Suspense>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;