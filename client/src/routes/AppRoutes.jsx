import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import LoginPage from "../pages/Auth/LoginPage.jsx";
import SignupPage from "../pages/Auth/SignupPage.jsx";
import HomePage from "../pages/Home/HomePage.jsx";
import BookingPage from "../pages/Booking/BookingPage.jsx";
import BookingDemo from "../pages/Demo/BookingDemo.jsx";
import PaymentPage from "../pages/Payment/PaymentPage.jsx";
import ConfirmationPage from "../pages/Payment/ConfirmationPage.jsx";
import ViewTicketPage from "../pages/Payment/ViewTicketPage.jsx";
import ProfilePage from "../pages/Profile/ProfilePage.jsx";
import AccountDetailsPage from "../pages/Profile/AccountDetailsPage.jsx";
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import MyBookingsPage from '../pages/Bookings/MyBookingsPage.jsx'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/account-details"
          element={
            <ProtectedRoute>
              <AccountDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/book/:tripId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demo/booking"
          element={<BookingDemo />}
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/confirmation"
          element={
            <ProtectedRoute>
              <ConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket/view"
          element={
            <ProtectedRoute>
              <ViewTicketPage />
            </ProtectedRoute>
          }
        />
        {/* More routes will be added progressively */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
