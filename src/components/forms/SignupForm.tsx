import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select"; // ✅ Make sure you have Select component
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { signup, signInWithGoogle } from "@/services/authService";

const SignupForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // default is user

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await signup(email, password, fullName, role); // ✅ passing role correctly
      alert("Signup successful!");
      navigate("/login"); // after signup go to login
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Google sign-in successful!");
      navigate("/user/dashboard"); // default Google login user
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-center">Defense AI Chat</h1>
        <p className="text-center text-gray-500 mt-2">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate("/login")}
        >
          <FaSignInAlt /> Login
        </Button>
        <Button
          variant="default"
          className="flex items-center gap-2"
          disabled
        >
          <FaUserPlus /> Sign Up
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* ✅ Role Selection */}
        <Select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </Select>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-grow border-t" />
        <span className="mx-2 text-gray-400 text-sm">or continue with</span>
        <div className="flex-grow border-t" />
      </div>

      {/* Social Login Buttons */}
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

export default SignupForm;
