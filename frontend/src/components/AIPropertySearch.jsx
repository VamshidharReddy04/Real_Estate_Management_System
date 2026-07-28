import { useState } from "react";
import PropertyCard from "./PropertyCard";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AIPropertySearch() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [interpretedFilters, setInterpretedFilters] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError("");
    setHistory((prev) => [...prev, { role: "user", text: message }]);

    try {
      const res = await fetch(`${API_BASE}/api/properties/ai-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setResults(data.results || []);
      setInterpretedFilters(data.interpretedFilters || null);

      setHistory((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Found ${data.count} ${data.count === 1 ? "property" : "properties"} matching your search.`,
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try rephrasing your search.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="ai-property-search max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-3">Ask about properties</h2>
      <p className="text-sm text-gray-500 mb-4">
        Try: "2BHK under 50L in Gachibowli" or "villas above 1 crore in
        Kondapur"
      </p>

      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {history.map((entry, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-sm max-w-[80%] ${
              entry.role === "user"
                ? "bg-blue-100 ml-auto text-right"
                : "bg-gray-100"
            }`}
          >
            {entry.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the property you're looking for..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {interpretedFilters && (
        <p className="text-xs text-gray-400 mb-4">
          Interpreted as: {JSON.stringify(interpretedFilters)}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>

      {!loading && results.length === 0 && history.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          No properties matched that search.
        </p>
      )}
    </div>
  );
}
