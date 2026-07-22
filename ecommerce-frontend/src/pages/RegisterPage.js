import React from "react";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { setAuthSession } from "../lib/auth";
import { showErrorToast, showSuccessToast } from "../lib/toast";

function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      showErrorToast("Password and confirm password must match.");
      return;
    }
    setLoading(true);
    try {
      const data = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password
      });
      const session = setAuthSession(data.accessToken, data.role);
      onRegister(session);
      showSuccessToast("Registration successful.");
      navigate("/");
    } catch (err) {
      showErrorToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card auth-card">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={onSubmit}>
        <label>
          Name
          <input value={form.name} onChange={(e) => onChange("name", e.target.value)} required />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <div className="input-with-icon input-with-overlay-icon">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => onChange("password", e.target.value)}
              minLength={8}
              required
            />
            <button
              type="button"
              className="icon-button password-toggle-button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
        </label>
        <label>
          Confirm Password
          <div className="input-with-icon input-with-overlay-icon">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => onChange("confirmPassword", e.target.value)}
              minLength={8}
              required
            />
            <button
              type="button"
              className="icon-button password-toggle-button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
        </label>
        <button type="submit" className="auth-submit-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="muted auth-switch-text">
        Already registered?{" "}
        <Link to="/login" className="auth-switch-link">
          Login
        </Link>
      </p>
    </section>
  );
}

export default RegisterPage;
