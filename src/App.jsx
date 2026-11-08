import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppHeader, { isStaffArea } from './components/AppHeader'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import PricingPage from './pages/PricingPage'
import BookingPage from './pages/BookingPage'
import LivePage from './pages/LivePage'
import AboutPage from './pages/AboutPage'
import ActivitiesPage from './pages/ActivitiesPage'
import ContactPage from './pages/ContactPage'
import RulesPage from './pages/RulesPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import UserManagementPage from './pages/admin/UserManagementPage'
import StaffManagementPage from './pages/admin/StaffManagementPage'
import SessionManagementPage from './pages/admin/SessionManagementPage'
import SkateInventoryPage from './pages/admin/SkateInventoryPage'
import CashierPosPage from './pages/admin/CashierPosPage'
import VerificationPage from './pages/admin/VerificationPage'
import FinancePage from './pages/admin/FinancePage'
import VolunteerReservationsPage from './pages/volunteer/VolunteerReservationsPage'
import VolunteerInventoryPage from './pages/volunteer/VolunteerInventoryPage'
import VolunteerShiftsPage from './pages/volunteer/VolunteerShiftsPage'
import ShiftOverviewPage from './pages/coordinator/ShiftOverviewPage'
import ShiftSlotPlannerPage from './pages/coordinator/ShiftSlotPlannerPage'
import MyTicketsPage from './pages/user/MyTicketsPage'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './auth/AuthContext'

const ADMIN = ['ROLE_ADMIN']
const COORD = ['ROLE_ADMIN', 'ROLE_COORDINATOR']
const OVERVIEW = ['ROLE_ADMIN', 'ROLE_COORDINATOR', 'ROLE_CASHIER']
const STAFF = [
  'ROLE_ADMIN',
  'ROLE_COORDINATOR',
  'ROLE_CASHIER',
  'ROLE_VOLUNTEER',
]
const VOLUNTEER_STAFF = ['ROLE_ADMIN', 'ROLE_COORDINATOR', 'ROLE_VOLUNTEER']
const POS = ['ROLE_ADMIN', 'ROLE_CASHIER']
const VERIFY = [
  'ROLE_ADMIN',
  'ROLE_COORDINATOR',
  'ROLE_CASHIER',
  'ROLE_VOLUNTEER',
]

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function StaffHome() {
  const { isAdmin, isCoordinator, isCashier } = useAuth()
  if (isAdmin) return <AdminDashboardPage />
  if (isCoordinator) return <Navigate to="/admin/shifts" replace />
  if (isCashier) return <Navigate to="/admin/pos" replace />
  return <Navigate to="/volunteer/reservations" replace />
}

export default function App() {
  const { pathname } = useLocation()
  const { isStaff } = useAuth()
  const showPublicFooter = !(isStaff && isStaffArea(pathname))

  return (
    <div className="relative min-h-screen">
      <ScrollToTop />
      <AppHeader />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/qiymetler" element={<PricingPage />} />
          <Route path="/bilet" element={<BookingPage />} />
          <Route path="/canli" element={<LivePage />} />
          <Route
            path="/biletlerim"
            element={
              <ProtectedRoute>
                <MyTicketsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/haqqimizda" element={<AboutPage />} />
          <Route path="/fealiyyetler" element={<ActivitiesPage />} />
          <Route path="/elaqe" element={<ContactPage />} />
          <Route path="/qaydalar" element={<RulesPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={STAFF}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute roles={STAFF}>
                  <StaffHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="staff"
              element={
                <ProtectedRoute roles={ADMIN}>
                  <StaffManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute roles={ADMIN}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="shifts"
              element={
                <ProtectedRoute roles={OVERVIEW}>
                  <ShiftOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="shift-slots"
              element={
                <ProtectedRoute roles={COORD}>
                  <ShiftSlotPlannerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="sessions"
              element={
                <ProtectedRoute roles={ADMIN}>
                  <SessionManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="skates"
              element={
                <ProtectedRoute roles={ADMIN}>
                  <SkateInventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="finance"
              element={
                <ProtectedRoute roles={ADMIN}>
                  <FinancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="payments"
              element={
                <ProtectedRoute roles={ADMIN}>
                  <Navigate to="/admin/finance" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="pos"
              element={
                <ProtectedRoute roles={POS}>
                  <CashierPosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="verification"
              element={
                <ProtectedRoute roles={VERIFY}>
                  <VerificationPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/volunteer"
            element={
              <ProtectedRoute roles={VOLUNTEER_STAFF}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="reservations" replace />} />
            <Route
              path="reservations"
              element={
                <ProtectedRoute roles={VOLUNTEER_STAFF}>
                  <VolunteerReservationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="inventory"
              element={
                <ProtectedRoute roles={VOLUNTEER_STAFF}>
                  <VolunteerInventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="shifts"
              element={
                <ProtectedRoute roles={VOLUNTEER_STAFF}>
                  <VolunteerShiftsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {showPublicFooter && <Footer />}
      <AuthModal />
    </div>
  )
}
