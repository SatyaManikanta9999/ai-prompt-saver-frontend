import { useState, useEffect } from "react";
import PromptForm from "./components/PromptForm";
import PromptList from "./components/PromptList";
import SearchBar from "./components/SearchBar";

function App() {
  const [prompts, setPrompts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("darkMode") === "true";
});

  // Load from backend later (temporary localStorage)
  useEffect(() => {
  setLoading(true);
  fetch("http://localhost:8080/prompts")
    .then(res => {
      if (!res.ok) {
        throw new Error("Failed to fetch prompts");
      }
      return res.json();
    })
    .then(data => {
      setPrompts(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);

  useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

  useEffect(() => {
  if (toast) {
    const timer = setTimeout(() => {
      setToast("");
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [toast]);

  const addPrompt = async (text) => {
  try {
    const response = await fetch("http://localhost:8080/prompts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      alert("Prompt cannot be empty");
      return;
    }

    const newPrompt = await response.json();
    setPrompts((prev) => [...prev, newPrompt]);

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

  const deletePrompt = (id) => {
  const confirmDelete = window.confirm("Are you sure?");
  if (!confirmDelete) return;

  fetch(`http://localhost:8080/prompts/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      setPrompts(prompts.filter(p => p.id !== id));
    })
    .catch(err => console.error(err));
  };

  const updatePrompt = (id, newText) => {
  fetch(`http://localhost:8080/prompts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: newText }),
  })
    .then(res => res.json())
    .then(updated => {
      setPrompts(
        prompts.map((p) => (p.id === id ? updated : p))
      );
    })
    .catch(err => console.error(err));
};

  const filteredPrompts = prompts.filter((p) =>
    p.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1>AI Prompt Saver</h1>
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
      <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
      <SearchBar search={search} setSearch={setSearch} />
      <PromptForm addPrompt={addPrompt} />
      {/* Loading State */}
    {loading && <p>Loading prompts...</p>}

    {/* Error State */}
    {error && <p style={{ color: "red" }}>{error}</p>}

    {/* Empty State */}
    {!loading && prompts.length === 0 && (
      <p>No prompts saved yet.</p>
    )}
      <PromptList
        prompts={filteredPrompts}
        deletePrompt={deletePrompt}
        updatePrompt={updatePrompt}
        setToast={setToast}
      />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;