"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/app/config/api";

interface Idea {
  id: string;
  title: string;
  description: string;
  region: string;
  points: number;
  colaborative?: boolean;
  is_shortlisted?: boolean;
}

export default function EmployeeDashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [activePage, setActivePage] = useState("allIdeas");

  const fetchUserDetails = useCallback(async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User:", response.data.full_name); // Debugging (or remove)
    } catch (error) {
      console.error("Error fetching user details:", error);
      logout();
    }
  }, []);

  const fetchIdeas = useCallback(async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/ideas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdeas(response.data);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      setErrorMessage("Failed to load ideas. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/employee/signin");
    } else {
      fetchUserDetails(token);
      fetchIdeas(token);
    }
  }, [fetchUserDetails, fetchIdeas, router]);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/employee/signin");
  };

  const handlePageChange = (page: string) => {
    setActivePage(page);
    if (page === "allIdeas") {
      router.push("/employee/dashboard");
    } else if (page === "myIdeas") {
      router.push("/employee/myideas");
    } else if (page === "submitIdea") {
      router.push("/employee/submit-idea");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-8 px-6 fixed top-0 left-0 h-full">
        <h1 className="text-2xl font-extrabold mb-8">Welcome to Idea Hub</h1>
        <div className="space-y-4">
          <button
            onClick={() => handlePageChange("allIdeas")}
            className={`block text-center px-6 py-3 rounded-md w-full ${
              activePage === "allIdeas" ? "bg-black" : "bg-white text-black"
            }`}
          >
            All Ideas
          </button>
          <button
            onClick={() => handlePageChange("myIdeas")}
            className={`block text-center px-6 py-3 rounded-md w-full ${
              activePage === "myIdeas" ? "bg-black" : "bg-white text-black"
            }`}
          >
            My Ideas
          </button>
          <button
            onClick={() => handlePageChange("submitIdea")}
            className={`block text-center px-6 py-3 rounded-md w-full ${
              activePage === "submitIdea" ? "bg-black" : "bg-white text-black"
            }`}
          >
            Submit New Idea
          </button>
          <button
            onClick={logout}
            className="block text-center px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 w-full py-10 px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">All Ideas</h2>
        </div>

        {loading ? (
          <p>Loading ideas...</p>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : ideas.length > 0 ? (
          <ul className="space-y-6 max-w-6xl mx-auto">
            {ideas.map((idea) => (
              <li
                key={idea.id}
                className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-300 hover:shadow-2xl relative"
              >
                {/* Collaborative or Shortlisted Label */}
                <div className="absolute top-4 right-4 space-y-2 text-right">
                  {idea.colaborative && (
                    <p className="text-blue-500 font-bold">
                      Collaborative Idea
                    </p>
                  )}
                  {idea.is_shortlisted && (
                    <p className="text-green-500 font-bold">
                      Shortlisted Idea
                    </p>
                  )}
                </div>

                <h3 className="text-xl font-semibold">
                  <strong>Title:  </strong>{idea.title}
                </h3>
                <p className="mt-2 text-gray-500">
                  <strong>Region: </strong> {idea.region}
                </p>
                <p className="mt-2 text-gray-500">
                  <strong>Reward Points:  </strong> {idea.points}
                </p>
                <p className="mt-4">
                  <strong>Description:  </strong>{idea.description}
                </p>
                <div className="mt-6 text-left">
                  <a
                    href={`/employee/idea/${idea.id}`}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    View Idea
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ideas available.</p>
        )}
      </div>
    </div>
  );
}
