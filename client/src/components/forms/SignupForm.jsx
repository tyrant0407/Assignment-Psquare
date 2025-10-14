import { useState } from "react";
import { Link } from "react-router";

export default function SignupForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [validationError, setValidationError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear validation error when user starts typing
    if (validationError) setValidationError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate password confirmation
    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    // Remove confirmPassword from the data sent to backend
    const { confirmPassword, ...submitData } = form;
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-s text-gray-700 mb-1">Name</label>
        <input
          name="name"
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={onChange}
          className="w-full rounded-md border border-gray-300 px-3 py-3 text-s focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-s text-gray-700 mb-1">Email</label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange}
          className="w-full rounded-md border border-gray-300 px-3 py-3 text-s focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-s text-gray-700 mb-1">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={onChange}
          className="w-full rounded-md border border-gray-300 px-3 py-3 text-s focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-s text-gray-700 mb-2">Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={form.confirmPassword}
          onChange={onChange}
          className="w-full rounded-md border border-gray-300 px-3 py-3 text-s focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
          required
        />
      </div>

      {(error || validationError) && (
        <p className="text-xs text-red-600">{validationError || error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-s font-medium py-3 rounded-md disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <p className="mt-4 text-center text-s text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log In
        </Link>
      </p>
    </form>
  );
}
