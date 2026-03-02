import { useState } from "react";

function PromptForm({ addPrompt }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return; // stop if empty
    }

    addPrompt(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="form-row">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your prompt..."
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default PromptForm;