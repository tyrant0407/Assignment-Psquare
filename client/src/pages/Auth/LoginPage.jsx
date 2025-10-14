import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import LoginForm from "../../components/forms/LoginForm.jsx";
import Logo from '../../assets/icons/logo.png'

export default function LoginPage() {
  const { login, loading, error, clearAuthError, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (formData) => {
    clearAuthError();
    const success = await login(formData);
    if (success) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md h-auto bg-white shadow-lg rounded-2xl p-8 sm:w-[486px] sm:h-[630px]">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
          <img src={Logo} alt="" />
        </div>
        <h1 className="text-center text-2xl font-extrabold">
          Log In to Journey Booking Platform
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Welcome back! Please enter your credentials to continue.
        </p>

        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
      </div>
    </div>
  );
}
