// resources/js/Components/LoginModal.jsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "@inertiajs/react";
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
          background: "#0D0C0C", // Sesuai warna modal kamu
          color: "#F2F2F2",
          iconColor: "#FF2146", // Warna merah khas
          confirmButtonColor: "#F2AF29", // Warna kuning gradasi kamu
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

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {/* Email */}
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
          className="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 disabled:from-[#69747C] disabled:to-[#69747C] text-[#F2F2F2] font-semibold rounded-md p-3 text-base transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed"
        >
          {processing ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-[#0D0C0C]/50 border border-[#69747C]/30 rounded-md">
        <p className="text-[#69747C] text-sm mb-2">Login Information:</p>
        <div className="text-[#F2F2F2] text-xs space-y-1">
          <p>Hanya Untuk Sang Admin. User Role Menyusul</p>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
