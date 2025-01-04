"use client";

import { useState, useEffect, useCallback, use } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/config/api";

// Define the expected prop type for dynamic route params
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Define the type for idea data returned from API
interface Idea {
  title: string;
  description: string;
  region: string;
  colaborative: boolean;
  approved: boolean;
}

// Component now uses PageProps to satisfy Next.js requirements
export default function UpdateIdeaPage({ params }: PageProps) {
  const resolvedParams = use(params); // Unwrap the params using React.use()
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [region, setRegion] = useState<string>("Select Region");
  const [colaborative, setColaborative] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const regions = [
    "Africa",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
    "Antarctica",
  ];

  // Fetch Idea Data - useCallback to prevent missing dependency warnings
  const fetchIdeaData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("You must be logged in to update an idea.");
      setLoading(false);
      return;
    }

    try {
      const { data }: { data: Idea } = await axios.get(
        `${BASE_URL}/api/v1/ideas/${resolvedParams.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle(data.title);
      setDescription(data.description);
      setRegion(data.region);
      setColaborative(data.colaborative);
      setApproved(data.approved);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Failed to fetch the idea details.");
      setLoading(false);
      console.error(error);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchIdeaData();
  }, [fetchIdeaData]);

  // Handle form submission
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorMessage("You must be logged in to update an idea.");
      return;
    }

    if (region === "Select Region") {
      setErrorMessage("Please select a region.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/v1/ideas/${resolvedParams.id}`,
        {
          idea: {
            title,
            description,
            region,
            colaborative,
            approved: false, // Reset approval status to false upon update
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Your idea has been updated successfully!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to update idea. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-700 flex justify-center items-center p-8">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-3xl">
        {/* Go Back Button */}
        <button
          onClick={() => router.back()}
          className="text-blue-500 hover:text-blue-700 flex items-center space-x-2 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-lg font-semibold">Go Back</span>
        </button>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Update Idea</h1>

        {successMessage && (
          <div className="mb-4 text-green-500 font-semibold p-3 rounded-md bg-green-50">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 text-red-500 font-semibold p-3 rounded-md bg-red-50">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <p>Loading idea...</p>
        ) : (
          <form onSubmit={handleUpdateSubmit}>
            {/* Title Input */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-md shadow-md"
                required
              />
            </div>

            {/* Description Textarea */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-md shadow-md"
                rows={6}
                required
              />
            </div>

            {/* Region Dropdown */}
            <div className="mb-6">
              <label htmlFor="region" className="block text-lg font-medium text-gray-700 mb-2">
                Region
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-md shadow-md"
                required
              >
                <option disabled>Select Region</option>
                {regions.map((regionOption, index) => (
                  <option key={index} value={regionOption}>
                    {regionOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Collaborative Checkbox */}
            <div className="mb-6 flex items-center">
              <input
                id="colaborative"
                type="checkbox"
                checked={colaborative}
                onChange={(e) => setColaborative(e.target.checked)}
                className="mr-4 h-5 w-5 text-blue-500"
              />
              <label htmlFor="colaborative" className="text-lg text-gray-700">
                Collaborative Idea
              </label>
            </div>

            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md">
              Update Idea
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
