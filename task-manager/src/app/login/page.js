"use client";

import { useState } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-80 mx-auto mt-12 border border-black p-6">
      <h2 className="border-b border-black pb-2 text-center font-semibold">
        {isLogin ? "Login" : "Sign Up"}
      </h2>

      <form className="flex flex-col gap-3 mt-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            className="border border-black px-2 py-1"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="border border-black px-2 py-1"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-black px-2 py-1"
        />

        <button
          type="submit"
          className="border border-black px-2 py-1 bg-transparent"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {isLogin ? (
        <div className="mt-4 border-t border-black pt-2 text-sm">
          <button className="underline bg-transparent border-none">
            Forgot Password?
          </button>
          <p className="mt-2">
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
        <div className="mt-4 border-t border-black pt-2 text-sm">
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
