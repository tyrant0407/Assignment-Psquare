import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import SignupForm from "../../components/forms/SignupForm.jsx";
import Logo from '../../assets/icons/logo.png'

export default function SignupPage() {
  const { register, loading, error, clearAuthError, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleRegister = async (formData) => {
    clearAuthError();
    const success = await register(formData);
    if (success) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md h-auto bg-white shadow-lg rounded-2xl p-8 sm:w-[486px] sm:h-[730px]">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
         <img src={Logo} alt="" srcset="" />
        </div>
        <h1 className="text-center text-2xl font-extrabold">
          Create your account
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Join the Journey Booking Platform.
        </p>
        <SignupForm onSubmit={handleRegister} loading={loading} error={error} />
      </div>
    </div>
  );
}
