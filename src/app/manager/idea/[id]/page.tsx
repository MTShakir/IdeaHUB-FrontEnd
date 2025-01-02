"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/config/api";
import { useRouter } from "next/navigation";

export default function IdeaPage({ params }: { params: { id: string } }) {
  const [idea, setIdea] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/employee/signin");
    } else {
      fetchIdea(token);
      fetchComments(token);
    }
  }, []);

  const fetchIdea = async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/ideas/${params.id}`, {
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

  const fetchComments = async (token: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/ideas/${params.id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const response = await axios.put(
        `${BASE_URL}/api/v1/ideas/${params.id}`,
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
        points: idea.points + (isShortlisted ? -20 : 20),
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
        `${BASE_URL}/api/v1/ideas/${params.id}/comments`,
        { content: feedback },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Feedback submitted successfully!");
      setFeedback("");
      fetchComments(token);  // Refresh the comments after submission
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-yellow-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Idea</h1>
          <button
            onClick={() => router.push("/manager/dashboard")}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto mt-8">
        {loading ? (
          <p>Loading idea...</p>
        ) : errorMessage ? (
          <p className="text-red-600">{errorMessage}</p>
        ) : idea ? (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">{idea.title}</h3>
            <p className="mt-4">{idea.description}</p>
            <p className="mt-4 text-gray-600">Points: {idea.points}</p>

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
              <h4 className="text-xl font-bold">Feedback</h4>
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
