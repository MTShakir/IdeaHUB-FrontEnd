"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/app/config/api";

export default function IdeaPage() {
  const params = useParams(); // Use useParams to get the params
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [activePage, setActivePage] = useState("allIdeas"); // Track the active page
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/employee/signin");
    } else {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.user_id);
      fetchIdea(token);
      fetchComments(token);
    }
  }, []);

  const fetchIdea = async (token: string) => {
    if (!params?.id) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/ideas/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdea(response.data);
      setHasVoted(response.data.has_voted || false);
      // Check if the idea is submitted by the current user, then set the active page accordingly
      if (response.data.user_id === userId) {
        setActivePage("myIdeas");
      } else {
        setActivePage("allIdeas");
      }
    } catch (error) {
      console.error("Error fetching idea:", error);
      setErrorMessage("Failed to load the idea. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (token: string) => {
    if (!params?.id) return;
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

  const handleVote = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/employee/signin");
      return;
    }

    try {
      const voteType = hasVoted ? "down" : "up";
      await axios.post(
        `${BASE_URL}/api/v1/ideas/${params.id}/vote`,
        { vote_type: voteType },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHasVoted(!hasVoted);
      setIdea((prevIdea: any) => ({
        ...prevIdea,
        points: hasVoted ? prevIdea.points - 10 : prevIdea.points + 10,
      }));
    } catch (error) {
      console.error("Error voting on idea:", error);
      setErrorMessage("Failed to process your vote. Please try again later.");
    }
  };

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/employee/signin");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/ideas/${params.id}/comments`,
        { content: comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newComment = response.data;
      // Assign a default date to the new comment until it's refreshed
      newComment.created_at = new Date().toISOString();
      setComments((prevComments) => [...prevComments, newComment]);
      setComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setErrorMessage("Failed to submit your comment. Please try again later.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/employee/signin");
      return;
    }

    try {
      const response = await axios.delete(`${BASE_URL}/api/v1/ideas/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Idea deleted successfully");
      router.push("/employee/dashboard");
    } catch (error) {
      console.error("Error deleting idea:", error);
      setErrorMessage("Failed to delete the idea. Please try again later.");
    }
  };

  const handleUpdate = () => {
    router.push(`/employee/submit-idea/${params.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar with Navigation */}
      <div className="w-64 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-8 px-6 fixed top-0 left-0 h-full">
        <h1 className="text-2xl font-extrabold mb-8">Welcome to Idea Hub</h1>
        <div className="space-y-4">
          <button
            onClick={() => router.push("/employee/dashboard")}
            className={`block text-center px-6 py-3 rounded-md transition duration-300 w-full ${
              activePage === "allIdeas" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            All Ideas
          </button>
          <button
            onClick={() => router.push("/employee/myideas")}
            className={`block text-center px-6 py-3 rounded-md transition duration-300 w-full ${
              activePage === "myIdeas" ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            My Ideas
          </button>
          <button
            onClick={() => router.push("/employee/submit-idea")}
            className="block text-center px-6 py-3 rounded-md transition duration-300 w-full bg-white text-black"
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
      <main className="ml-72 w-full py-10 px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Idea Details</h2>
          <button
            onClick={() => router.back()}
            className="text-white bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Back
          </button>
        </div>

        {loading ? (
          <p>Loading idea...</p>
        ) : errorMessage ? (
          <p className="text-red-600">{errorMessage}</p>
        ) : idea ? (
          <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                {idea.is_shortlisted && (
                  <p className="text-green-500 font-bold text-lg">Shortlisted Idea</p>
                )}
                <h2 className="text-2xl font-bold mb-4">{idea.title}</h2>
                <p className="text-gray-500 mb-4">Region: {idea.region}</p>
                <p className="text-gray-700 mb-4">{idea.description}</p>
                <p className="text-gray-600">
                  Points: <strong>{idea.points}</strong>
                </p>
              </div>
              {idea.user_id === userId ? (
                <div className="mt-4">
                  {idea.colaborative && (
                    <p className="text-blue-500 font-bold mt-4">Collaborative Idea</p>
                  )}
                  <button
                    onClick={handleDelete}
                    className="mt-4 px-4 py-2 text-white font-bold rounded bg-red-600"
                  >
                    Delete Idea
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="mt-4 ml-2 px-4 py-2 text-white font-bold rounded bg-yellow-600"
                  >
                    Update Idea
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleVote}
                  className={`mt-4 px-4 py-2 text-white font-bold rounded ${
                    hasVoted ? "bg-red-600" : "bg-blue-600"
                  }`}
                >
                  {hasVoted ? "Undo Vote" : "Vote"}
                </button>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-2">Comments</h3>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                placeholder="Write a comment..."
              ></textarea>
              <button
                onClick={handleCommentSubmit}
                className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-500"
              >
                Submit Comment
              </button>
              <ul className="mt-4 bg-gray-50 p-4 rounded">
                {comments.map((c) => (
                  <li key={c.id} className="border-b py-2">
                    <p className="text-gray-800">{c.content}</p>
                    <p className="text-sm text-gray-500">
                      Posted on {new Date(c.created_at).toLocaleDateString()}
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
