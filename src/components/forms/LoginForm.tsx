import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { login, signInWithGoogle, resetPassword } from "@/services/authService";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login(email, password); // fetch user role
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Google sign-in successful!");
      navigate("/user/dashboard"); // Assume Google login redirects to user dashboard
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first!");
      return;
    }
    try {
      await resetPassword(email);
      alert("Password reset email sent!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-center">Defense AI Chat</h1>
        <p className="text-center text-gray-500 mt-2">Welcome back! Log in to your account.</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <Button variant="default" className="flex items-center gap-2" disabled>
          <FaSignInAlt /> Login
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <FaUserPlus /> Sign Up
        </Button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t" />
        <span className="mx-2 text-gray-400 text-sm">or continue with</span>
        <div className="flex-grow border-t" />
      </div>

      {/* Social Logins */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="text-xl" /> Google
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          disabled
        >
          <FaMicrosoft className="text-xl" /> Microsoft
        </Button>
      </div>
    </Card>
  );
};

export default LoginForm;
