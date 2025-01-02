"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-wide">Idea Hub</h1>
          <p className="mt-3 text-lg font-light">Collaborate and share ideas for a better future</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center mt-12 space-y-8 px-4">
        <p className="text-2xl font-semibold text-gray-800">Sign Up or Log In to get started:</p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center space-x-4 space-y-4 sm:space-y-0">
          <Link
            href="/employee/signup"
            className="px-8 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
          >
            Sign Up as Employee
          </Link>
          
          <Link
            href="/employee/signin"
            className="px-8 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-105"
          >
            Login as Employee
          </Link>
          <Link
            href="/manager/signin"
            className="px-8 py-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition transform hover:scale-105"
          >
            Login as Manager
          </Link>
        </div>

        {/* Admin Login */}
        <div className="mt-6">
          <Link
            href="https://mysite-kkqt.onrender.com/"
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Admin Login
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center text-sm">
          <p>
            &copy; 2024 <span className="font-bold">Idea Hub</span>. All rights reserved.
          </p>
          <p className="mt-2">
            Powered by <span className="text-blue-400">Your Company</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
