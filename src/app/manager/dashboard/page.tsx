"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/config/api"; // Import your base URL

export default function ManagerDashboard() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/employee/signin");
    } else {
      fetchIdeas(token);
    }
  }, []);

  const fetchIdeas = async (token: string) => {
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
  };

  const handleShortlist = async (id: number, isShortlisted: boolean) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/employee/signin");
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/ideas/${id}`,
        {
          idea: {
            is_shortlisted: !isShortlisted,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) =>
          idea.id === id
            ? {
                ...idea,
                is_shortlisted: !isShortlisted,
                points: idea.points + (isShortlisted ? 0 : 0),
              }
            : idea
        )
      );
    } catch (error) {
      console.error("Error shortlisting idea:", error);
      setErrorMessage("Failed to shortlist idea. Please try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/employee/signin");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white py-8 px-6 fixed top-0 left-0 h-full">
        <h1 className="text-2xl font-extrabold mb-8">Manager Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <main className="ml-72 w-full py-10 px-6">
        <h2 className="text-xl font-bold mb-4">Ideas</h2>
        {loading ? (
          <p>Loading ideas...</p>
        ) : errorMessage ? (
          <p className="text-red-600">{errorMessage}</p>
        ) : ideas.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300"
              >
                <h3 className="text-lg font-bold">{idea.title}</h3>
                <p className="mt-2 text-gray-700">{idea.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-gray-500">Points: {idea.points}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShortlist(idea.id, idea.is_shortlisted)}
                      className={`px-3 py-1 rounded-md ${
                        idea.is_shortlisted
                          ? "bg-gray-500 text-white"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      }`}
                    >
                      {idea.is_shortlisted ? "Unshortlist" : "Shortlist"}
                    </button>
                    <a
                      href={`/manager/idea/${idea.id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Manage Idea
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No ideas available.</p>
        )}
      </main>
    </div>
  );
}
