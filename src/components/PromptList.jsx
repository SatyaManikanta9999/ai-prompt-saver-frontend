import PromptCard from "./PromptCard";

function PromptList({
  prompts,
  deletePrompt,
  updatePrompt,
  setToast,
}) {
  return (
    <div>
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          deletePrompt={deletePrompt}
          updatePrompt={updatePrompt}
          setToast={setToast}
        />
      ))}
    </div>
  );
}

export default PromptList;