// app/admin/login/page.tsx
export default function AdminLogin() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-red-600">Admin Login</h2>
          <form className="space-y-6 mt-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your admin email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }
  