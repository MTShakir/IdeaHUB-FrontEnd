"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [tab, setTab] = useState("all"); // 'all' for All Ideas, 'new' for New Ideas
  const [allIdeas, setAllIdeas] = useState([
    { id: 1, title: "Idea 1", description: "Description of idea 1", status: "approved" },
    { id: 2, title: "Idea 2", description: "Description of idea 2", status: "approved" },
  ]);

  const [newIdeas, setNewIdeas] = useState([
    { id: 3, title: "Idea 3", description: "Description of idea 3", status: "pending" },
    { id: 4, title: "Idea 4", description: "Description of idea 4", status: "pending" },
  ]);

  const handleApprove = (id: number) => {
    const idea = newIdeas.find((idea) => idea.id === id);
    if (idea) {
      setAllIdeas([...allIdeas, { ...idea, status: "approved" }]);
      setNewIdeas(newIdeas.filter((idea) => idea.id !== id));
    }
  };

  const handleDecline = (id: number) => {
    setNewIdeas(newIdeas.filter((idea) => idea.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto mt-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-2 rounded-md ${
              tab === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            All Ideas
          </button>
          <button
            onClick={() => setTab("new")}
            className={`px-4 py-2 rounded-md ${
              tab === "new" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            New Ideas
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {tab === "all" && (
            <div>
              <h2 className="text-xl font-bold mb-4">All Ideas</h2>
              {allIdeas.length > 0 ? (
                <ul className="space-y-4">
                  {allIdeas.map((idea) => (
                    <li key={idea.id} className="bg-white shadow-md rounded-lg p-4">
                      <h3 className="text-lg font-bold">{idea.title}</h3>
                      <p className="mt-2 text-gray-700">{idea.description}</p>
                      <span className="mt-4 text-green-600">Status: {idea.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No ideas to display.</p>
              )}
            </div>
          )}

          {tab === "new" && (
            <div>
              <h2 className="text-xl font-bold mb-4">New Submitted Ideas</h2>
              {newIdeas.length > 0 ? (
                <ul className="space-y-4">
                  {newIdeas.map((idea) => (
                    <li key={idea.id} className="bg-white shadow-md rounded-lg p-4">
                      <h3 className="text-lg font-bold">{idea.title}</h3>
                      <p className="mt-2 text-gray-700">{idea.description}</p>
                      <div className="mt-4 flex space-x-4">
                        <button
                          onClick={() => handleApprove(idea.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecline(idea.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Decline
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No new ideas to review.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
