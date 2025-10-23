// resources/js/Components/LoginModal.jsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import logo from "../images/test.png";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const LoginModal = ({ show, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    login: "",
    password: "",
    remember: false,
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const loginUrl = window.route ? route("login") : "/login";

    post(loginUrl, {
      onSuccess: () => {
        onClose();
        reset("password");
        Swal.fire({
          title: "Login Berhasil!",
          text: "Selamat datang kembali, Admin.",
          icon: "success",
          background: "#0D0C0C",
          color: "#F2F2F2",
          confirmButtonColor: "#FF2146",
          confirmButtonText: "Lanjutkan",
          customClass: {
            popup: "rounded-xl shadow-lg border border-[#FF2146]/30",
            confirmButton: "text-[#F2F2F2] font-semibold px-4 py-2",
          },
        });
      },
      onError: (err) => {
        onClose();
        reset("password");

        Swal.fire({
          title: "Login Gagal",
          text: "Email atau password salah. Silakan coba lagi.",
          icon: "error",
          background: "#0D0C0C",
          color: "#F2F2F2",
          iconColor: "#FF2146",
          confirmButtonColor: "#F2AF29",
          confirmButtonText: "Tutup",
          customClass: {
            popup: "rounded-xl shadow-lg border border-[#FF2146]/30",
            title: "text-[#FF2146] font-semibold",
            confirmButton: "text-[#0D0C0C] font-semibold px-4 py-2 rounded-md",
          },
        });
      },
      onFinish: () => reset("password"),
    });
  };

  const handleOAuthLogin = () => {
    const oauthUrl = window.route ? route("oauth.redirect") : "/oauth/redirect";
    window.location.href = oauthUrl;
  };

  return (
    <Modal title="Login" show={show} onClose={() => { reset(); onClose(); }}>
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src={logo}
          alt="Admin Logo"
          className="w-25 h-auto"
          style={{ width: "100px", height: "auto" }}
        />
      </div>

      {/* OAuth Button - start.gg */}
      <button
        onClick={handleOAuthLogin}
        className="w-full mb-6 flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* start.gg Icon */}
        <svg 
          className="w-6 h-6 z-10 group-hover:scale-110 transition-transform" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
        </svg>
        
        <span className="z-10 text-base">Sign in with start.gg</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center mb-6">
        <div className="flex-1 border-t border-[#69747C]/30"></div>
        <span className="px-4 text-sm text-[#69747C]">or continue with email</span>
        <div className="flex-1 border-t border-[#69747C]/30"></div>
      </div>

      {/* Traditional Login Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {/* Email/Username */}
        <div className="flex flex-col gap-2">
          <label className="text-[#F2F2F2] text-sm font-medium">
            Email or Username
          </label>
          <input
            type="text"
            name="login"
            value={data.login}
            onChange={(e) => setData("login", e.target.value)}
            className={`bg-[#0D0C0C]/50 border rounded-md p-3 text-[#F2F2F2] text-base outline-none transition-colors ${
              errors.email ? "border-red-500" : "border-[#69747C]"
            } focus:border-[#FF2146]`}
            placeholder="Enter your email or username"
            autoComplete="username"
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-[#F2F2F2] text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className={`bg-[#0D0C0C]/50 border rounded-md p-3 pr-10 text-[#F2F2F2] text-base outline-none transition-colors w-full ${
                errors.password ? "border-red-500" : "border-[#69747C]"
              } focus:border-[#FF2146]`}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#69747C] hover:text-[#F2F2F2]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={processing}
          className="bg-gradient-to-r from-[#69747C] to-[#69747C]/80 hover:from-[#69747C]/90 hover:to-[#69747C]/70 disabled:from-[#69747C]/50 disabled:to-[#69747C]/50 text-[#F2F2F2] font-semibold rounded-md p-3 text-base transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed border border-[#69747C]/30"
        >
          {processing ? "Signing In..." : "Sign In (Admin Only)"}
        </button>
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-[#0D0C0C]/50 border border-[#69747C]/30 rounded-md">
        <p className="text-[#69747C] text-sm mb-2">Login Information:</p>
        <div className="text-[#F2F2F2] text-xs space-y-1">
          <p>• <strong className="text-[#FF2146]">start.gg Login:</strong> Untuk semua player yang sudah terdaftar di tournament</p>
          <p>• <strong className="text-[#69747C]">Email Login:</strong> Khusus untuk Admin</p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;