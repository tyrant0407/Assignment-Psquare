import { useState } from "react";
import { Link } from "react-router";

export default function LoginForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="text-right mt-1">
          <a className="text-s text-blue-600 font-medium hover:underline" href="#">
            Forgot password?
          </a>
        </div>
      </div>

      {error && <p className="text-s text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-s font-medium py-3 rounded-md disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <p className="mt-4 text-center text-s text-gray-600">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
