import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [show_password, set_show_password] = useState(false);
  const [form_data, set_form_data] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  //function to validate form - if user doesn't input fields properly, throw errors
  // Depeding on it, we call the signup function - use toast
  const validate_form = () => {
    if (!form_data.full_name.trim()) {
      // .trim() removes leading and trailing whitespaces
      return toast.error("Full name is required");
    }

    if (!form_data.email.trim()) {
      return toast.error("Email is required");
    }
    if (!/\S+@\S+\.\S+/.test(form_data.email)) {
      // Generated the regexp with AI
      return toast.error("Invalid email format");
    }
    if (!form_data.password) {
      return toast.error("Password is required");
    }
    if (form_data.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    return true;
  };
  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // To prevent refresh
    const success = validate_form();

    if (success === true) {
      signup(form_data);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side of the form */}
      <div className="flex flex-col justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get Started with your account
              </p>
            </div>
          </div>
          <form onSubmit={handle_submit} className="space-y-6">
            {/* DaisyUI Classes */}

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="LeBron James"
                  value={form_data.full_name}
                  onChange={(e) =>
                    set_form_data({ ...form_data, full_name: e.target.value })
                  }
                />
              </div>
            </div>
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="lebronjames@goat.com"
                  value={form_data.email}
                  onChange={(e) =>
                    set_form_data({ ...form_data, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={show_password ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="........"
                  value={form_data.password}
                  onChange={(e) =>
                    set_form_data({ ...form_data, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => set_show_password(!show_password)}
                >
                  {show_password ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right-Side */}
      <AuthImagePattern
        title="Join Our Community"
        subtitle=" Connect with your friends"
      />
    </div>
  );
};

export default SignUpPage;
