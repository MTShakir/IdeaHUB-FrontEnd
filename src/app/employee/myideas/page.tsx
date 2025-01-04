"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/config/api";

export default function MyIdeas() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activePage, setActivePage] = useState("myIdeas");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("You must be logged in to view your ideas.");
      setLoading(false);
      return;
    }

    const fetchMyIdeas = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/ideas/my_ideas`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIdeas(response.data);
      } catch (error) {
        setErrorMessage("Failed to fetch your ideas. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyIdeas();
  }, []);

  // Handle button click to switch active page
  const handlePageChange = (page: string) => {
    setActivePage(page);
    if (page === "allIdeas") {
      router.push("/employee/dashboard");
    } else if (page === "submitIdea") {
      router.push("/employee/submit-idea");
    } else if (page === "myIdeas") {
      router.push("/employee/myideas");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Header */}
      <div className="w-64 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-8 px-6 fixed top-0 left-0 h-full">
        <h1 className="text-2xl font-extrabold mb-8">Welcome to Idea Hub</h1>
        <div className="space-y-4">
          <button
            onClick={() => handlePageChange("allIdeas")}
            className={`block text-center px-6 py-3 rounded-md transition duration-300 w-full ${
              activePage === "allIdeas" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            All Ideas
          </button>
          <button
            onClick={() => handlePageChange("myIdeas")}
            className={`block text-center px-6 py-3 rounded-md transition duration-300 w-full ${
              activePage === "myIdeas" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            My Ideas
          </button>
          <button
            onClick={() => handlePageChange("submitIdea")}
            className={`block text-center px-6 py-3 rounded-md transition duration-300 w-full ${
              activePage === "submitIdea" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Submit New Idea
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/employee/signin");
            }}
            className="block text-center px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 w-full"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 w-full py-10 px-6">
        {/* Dashboard Title */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">My Ideas</h2>
        </div>

        {/* Loading & Error Handling */}
        {loading ? (
          <p>Loading your ideas...</p>
        ) : errorMessage ? (
          <p className="text-red-600">{errorMessage}</p>
        ) : ideas.length > 0 ? (
          <div className="w-full max-w-6xl mx-auto">
            <ul className="space-y-6">
              {ideas.map((idea) => (
                <li
                  key={idea.id}
                  className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-300 hover:shadow-2xl transition duration-300 relative"
                >
                  {/* Shortlisted Label */}
                  {idea.is_shortlisted && (
                    <p className="text-green-500 font-bold text-lg">Shortlisted Idea</p>
                    
                  )}
                   {idea.colaborative && (
                  <p className="text-blue-500 font-bold mt-4">Collaborative Idea</p>
                )}

                  {/* Title */}
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">{idea.title}</h3>
                  </div>

                  {/* Region */}
                  <div className="mt-2 text-gray-500">
                    <span className="font-semibold">Region:</span> {idea.region}
                  </div>

                  {/* Description */}
                  <div className="mt-4">
                    <p className="text-gray-700">{idea.description}</p>
                  </div>

                  {/* Reward Points */}
                  
                  <div className="absolute top-4 right-4 space-y-2 text-right">
                    <div
                      className={`px-4 py-2 text-white font-bold rounded-lg ${
                        idea.points > 10
                          ? "bg-green-600"
                          : idea.points > 5
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      Reward Points: {idea.points}
                    </div>
                  </div>

                  {/* Approval Status */}
                  <div className="mt-4">
                    <p className="text-gray-600">
                      Status: {idea.approved ? "Approved by Admin" : "Waiting for Approval"}
                    </p>
                  </div>

                  {/* View Idea Button */}
                  <div className="mt-6 text-left">
                    <a
                      href={`/employee/idea/${idea.id}`}
                      className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      Manage My Idea
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>You have not submitted any ideas yet.</p>
        )}
      </div>
    </div>
  );
}
