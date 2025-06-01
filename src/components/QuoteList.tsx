import { useCallback, useState } from "react";
import RenderMatchHighlights from "./MatchHighlighter";

interface Props {
  items: string[];
  searchPattern: RegExp | undefined;
  selectedIndex: number;
  handleSelect: (index: number) => void;
  handleDelete: (index: number) => void;
  handleSubmitEdit: (replacementQuote: string) => void;
}

function QuoteList({
  items,
  searchPattern,
  selectedIndex,
  handleSelect,
  handleSubmitEdit,
  handleDelete
}: Props) {
  const [editingText, setEditingText] = useState("");
  const highlightFunc = useCallback((highlight: string) => <mark>{highlight}</mark>, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSubmitEdit(editingText);
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {items.map((entry, i) => (
        <li
          key={i}
          className={`flex items-start py-2 px-3 min-h-[3rem] rounded-md my-1 ${selectedIndex === i ? 'bg-blue-100 dark:bg-blue-900' : 'bg-white dark:bg-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          {selectedIndex === i ? (
            <button className="mr-2 p-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-gray-600 self-center" onClick={() => handleSelect(-1)} title="Cancel Edit">❌</button>
          ) : (
            <span className="mr-2 py-1 w-8 text-right text-gray-500 dark:text-gray-400">{i + 1}.</span>
          )}
          <div className="flex-1 px-2 self-stretch">
            {selectedIndex === i ? (
              <form onSubmit={handleSubmit} className="flex h-full">
                <textarea
                  name="replaceText"
                  defaultValue={entry}
                  onChange={(e) => {
                    setEditingText(e.target.value);
                    // Reset height to auto first to handle text deletion
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  onFocus={(e) => {
                    // Also adjust height when focused, in case of long initial text
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Escape") handleSelect(-1);
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmitEdit(editingText);
                    }
                  }}
                  className="flex-1 border rounded px-2 py-1 mr-2 resize-none overflow-hidden dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  style={{ minHeight: '1.5rem' }}
                />
              </form>
            ) : (
              <div className="py-1">
                <RenderMatchHighlights quoteText={entry} searchRegEx={searchPattern} highlightFunc={highlightFunc} />
              </div>
            )}
          </div>
          {selectedIndex === i ? (
            <button className="ml-2 px-2 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600 self-center" onClick={() => handleSubmitEdit(editingText)} title="Save Edit">➤</button>
          ) : (
            <>
              <button className="ml-2 px-2 py-1 border rounded hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200" onClick={() => handleSelect(i)} title="Edit">✎</button>
              <button className="ml-2 px-2 py-1 border rounded hover:bg-red-100 dark:hover:bg-red-900 dark:text-gray-200" onClick={() => handleDelete(i)} title="Delete">🗑</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default QuoteList;
