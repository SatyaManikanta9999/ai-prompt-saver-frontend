import { useState, useEffect, useRef } from "react";

function PromptCard({ prompt, deletePrompt, updatePrompt, setToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(prompt.text);
  const [showMenu, setShowMenu] = useState(false);

  const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
      setToast("Copied to clipboard!");
  };
  const menuRef = useRef();



  const openAI = (platform, text) => {
    const links = {
      chatgpt: "https://chat.openai.com/",
      claude: "https://claude.ai/",
      gemini: "https://gemini.google.com/",
      perplexity: "https://www.perplexity.ai/"
    };

    navigator.clipboard.writeText(text);
    window.open(links[platform], "_blank");
    setShowMenu(false); // 👈 close dropdown
  };

  const handleUpdate = () => {
    updatePrompt(prompt.id, editedText);
    setIsEditing(false);
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div className={`prompt-card ${showMenu ? "active-card" : ""}`}>
      {isEditing ? (
        <>
          <input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <span className="prompt-text">{prompt.text}</span>

          <div className="actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => deletePrompt(prompt.id)}>Delete</button>
            <button onClick={() => copyToClipboard(prompt.text)}>Copy</button>

            <div className="ai-wrapper" ref={menuRef}>
              <button
                className="ai-button"
                onClick={() => setShowMenu(!showMenu)}
              >
                🤖 AI ▼
              </button>

              {showMenu && (
                <div className="ai-dropdown">
                  <div onClick={() => openAI("chatgpt", prompt.text)}>
                    ChatGPT
                  </div>
                  <div onClick={() => openAI("claude", prompt.text)}>
                    Claude
                  </div>
                  <div onClick={() => openAI("gemini", prompt.text)}>
                    Gemini
                  </div>
                  <div onClick={() => openAI("perplexity", prompt.text)}>
                    Perplexity
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PromptCard;