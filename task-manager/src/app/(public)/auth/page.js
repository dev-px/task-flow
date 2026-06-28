"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSignupMutation, useLoginMutation } from "@/redux/services/authApi";
import { setCredentials } from "@/redux/slices/authSlice";
import { initialAuthState } from "@/utils/constant";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState(initialAuthState);
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.auth);
  const [error, setError] = useState({});

  // Hooks must be called at the top level
  useEffect(() => {
    // if (selector?.isAuthenticated) {
    //   router.push("/dashboard");
    // }
    console.log(selector);
  }, [selector]);

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [signup, { isLoading: signupLoading }] = useSignupMutation();

  const handleFormEdit = (e, key) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const checkForm = () => {
    const { name, email, password } = formData;
    let newErrors = { name: "", email: "", password: "" };

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!isLogin && !name) newErrors.name = "Name is required";

    setError(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkForm()) {
      try {
        if (isLogin) {
          // Call the mutation function returned by the hook
          const result = await login({
            email: formData.email,
            password: formData.password,
          }).unwrap();

          if (result?.success) {
            toast.success(result?.message);
            dispatch(
              setCredentials({
                user: result.data.user,
                token: result.data.accessToken,
              }),
            );
            router.push("/organizations");
          }
        } else {
          const result = await signup(formData).unwrap();
          if (result?.success) {
            toast.success(result?.message);
            toast.success("Please login to continue");
            setIsLogin(true);
          }
        }
      } catch (err) {
        console.error("Error during authentication:", err);
        toast.error(
          err?.data?.message || "An error occurred. Please try again.",
        );
      } finally {
        setFormData(initialAuthState);
        setError({});
      }
    }
  };

  return (
    <div className="w-96 mx-auto mt-16 border border-black p-8 rounded-lg shadow-md bg-white">
      <h2 className="border-b border-black pb-3 text-center text-xl font-bold">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleFormEdit(e, "name")}
              className={`border px-3 py-2 rounded w-full ${error.name ? "border-red-500" : "border-black"}`}
            />
            {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
          </div>
        )}

        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleFormEdit(e, "email")}
            className={`border px-3 py-2 rounded w-full ${error.email ? "border-red-500" : "border-black"}`}
          />
          {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleFormEdit(e, "password")}
            className={`border px-3 py-2 rounded w-full ${error.password ? "border-red-500" : "border-black"}`}
          />
          {error.password && (
            <p className="text-red-500 text-sm">{error.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="border border-black px-3 py-2 rounded bg-black text-white hover:bg-gray-800 transition"
          disabled={loginLoading || signupLoading}
        >
          {isLogin
            ? loginLoading
              ? "Logging in..."
              : "Login"
            : signupLoading
              ? "Signing up..."
              : "Sign Up"}
        </button>
      </form>

      {isLogin ? (
        <div className="mt-6 border-t border-black pt-3 text-sm text-center">
          <button
            className="underline bg-transparent border-none"
            onClick={() => setShowForgot(true)}
          >
            Forgot Password?
          </button>
          <p className="mt-3">
            Don’t have an account?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </span>
          </p>
        </div>
      ) : (
        <div className="mt-6 border-t border-black pt-3 text-sm text-center">
          <p>
            Already have an account?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => setIsLogin(true)}
            >
              Login
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
