"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/config/api";
import { useRouter } from "next/navigation";

// Adjust PageProps to handle the possible promise nature of params
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function IdeaPage({ params }: PageProps) {
  const [idea, setIdea] = useState<any>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [comments, setComments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/employee/signin");
    } else {
      // Wait for params to resolve if it's a Promise
      params.then((resolvedParams) => {
        fetchIdea(token, resolvedParams.id);
        fetchComments(token, resolvedParams.id);
      });
    }
  }, [router, params]);

  const fetchIdea = async (token: string, id: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/ideas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdea(response.data);
    } catch (error) {
      console.error("Error fetching idea:", error);
      setErrorMessage("Failed to load the idea. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (token: string, id: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/ideas/${id}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setErrorMessage("Failed to load comments. Please try again later.");
    }
  };

  const handleShortlist = async (isShortlisted: boolean) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/employee/signin");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/v1/ideas/${(await params).id}`,
        {
          idea: {
            is_shortlisted: !isShortlisted,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIdea({
        ...idea,
        is_shortlisted: !isShortlisted,
        points: idea.points + (isShortlisted ? 0 : 0),
      });
    } catch (error) {
      console.error("Error shortlisting idea:", error);
      setErrorMessage("Failed to shortlist idea. Please try again later.");
    }
  };

  const handleFeedbackSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/employee/signin");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/v1/ideas/${(await params).id}/comments`,
        { content: `${feedback} \n (Feedback From Manager)` },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Feedback submitted successfully!");
      setFeedback("");
      fetchComments(token, (await params).id); // Refresh the comments after submission
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage("Failed to submit feedback. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/employee/signin");
  };

  return (
    
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-black text-white py-8 px-6 fixed top-0 left-0 h-full">
        <h1 className="text-2xl font-extrabold mb-8">Manager Dashboard</h1>
        <button
            onClick={() => router.push("/manager/dashboard")}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-red-600"
          >
            Back to Dashboard
          </button>
          <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white my-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <main className="ml-72 w-full py-10 px-6">
        {loading ? (
          <p>Loading idea...</p>
        ) : errorMessage ? (
          <p className="text-red-600">{errorMessage}</p>
        ) : idea ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">{idea.title}</h3>
            <p className="mb-0 mt-4 text-gray-500 ">
                  <strong>Region: </strong> {idea.region}
                </p>
                <p className="mb-6 mt-0 text-gray-500 ">
                  <strong>Reward Points:  </strong> {idea.points}
                </p>
            <p className="mt-4">{idea.description}</p>

            <div className="mt-6">
              <button
                onClick={() => handleShortlist(idea.is_shortlisted)}
                className={`px-4 py-2 rounded-md ${
                  idea.is_shortlisted
                    ? "bg-gray-500 text-white"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                {idea.is_shortlisted ? "Unshortlist" : "Shortlist"}
              </button>
            </div>

            <div className="mt-6">
              <h4 className="text-xl font-bold">Provide Feedback</h4>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 border rounded-md mt-4"
                placeholder="Write your feedback here..."
              ></textarea>
              <button
                onClick={handleFeedbackSubmit}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </div>

            <div className="mt-6">
              <h4 className="text-xl font-bold mb-1">All Comments</h4>
              <ul className="space-y-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="p-4 bg-blue-100 rounded-md">
                    <p>{comment.content}</p>
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>No idea found.</p>
        )}
      </main>
    </div>
  );
}
