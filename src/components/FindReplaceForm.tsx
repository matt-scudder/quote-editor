import { useEffect, useState } from "react";
import escapeStringRegexp from "escape-string-regexp";
import React from "react";

interface Props {
  handleSetRegEx: (searchRegEx: RegExp | undefined) => void;
  handleReplaceTextChange: (replaceText: string) => void;
  setShowReplaceModal: (showReplaceModal: boolean) => void;
  numResultsFound: number;
}

function FindReplaceForm({
  handleSetRegEx,
  handleReplaceTextChange: handleReplaceChange,
  setShowReplaceModal,
  numResultsFound,
}: Props) {
  const [isValidRegex, setIsValidRegex] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [isUsingRegex, setIsUsingRegex] = useState(false);
  const [isMatchingWholeWords, setIsMatchingWholeWords] = useState(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);

  useEffect(() => {
    if (searchString) {
      try {
        let pattern = isUsingRegex ? searchString : escapeStringRegexp(searchString);
        pattern = isMatchingWholeWords ? `\\b${pattern}\\b` : pattern;
        const regex = new RegExp(pattern, isCaseSensitive ? "g" : "gi");
        setIsValidRegex(true);
        handleSetRegEx(regex);
      } catch {
        setIsValidRegex(false);
        handleSetRegEx(undefined);
      }
    } else {
      setIsValidRegex(false);
      handleSetRegEx(undefined);
    }
  }, [
    handleSetRegEx,
    searchString,
    isUsingRegex,
    isMatchingWholeWords,
    isCaseSensitive,
  ]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowReplaceModal(true);
  }

  const isValid = isValidRegex && numResultsFound > 0;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100">Find</label>
        <input
          type="text"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100">Replace</label>
        <input
          type="text"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow"
          onChange={(e) => handleReplaceChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
        <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer group relative">
          <input
            type="checkbox"
            checked={isCaseSensitive}
            onChange={e => setIsCaseSensitive(e.target.checked)}
            className="form-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="select-none text-gray-700 dark:text-gray-200 w-5 h-5 flex items-center justify-center rounded bg-black/10 dark:bg-white/10" title="Case sensitive">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <text x="4" y="18" fontFamily="sans-serif" fontSize="14px" fontWeight="bold">A</text>
              <text x="13" y="18" fontFamily="sans-serif" fontSize="14px">a</text>
            </svg>
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
            Case sensitive
          </span>
        </label>
        <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer group relative">
          <input
            type="checkbox"
            checked={isMatchingWholeWords}
            onChange={e => setIsMatchingWholeWords(e.target.checked)}
            className="form-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="select-none text-gray-700 dark:text-gray-200 w-5 h-5 flex items-center justify-center rounded bg-black/10 dark:bg-white/10" title="Match whole words">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <text x="8" y="17" fontFamily="sans-serif" fontSize="13px" textAnchor="middle">a</text>
              <text x="15" y="17" fontFamily="sans-serif" fontSize="13px" textAnchor="middle">b</text>
              <path d="M 3 18 L 3 20 L 21 20 L 21 18" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
            Match whole words
          </span>
        </label>
        <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer group relative">
          <input
            type="checkbox"
            checked={isUsingRegex}
            onChange={e => setIsUsingRegex(e.target.checked)}
            className="form-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="select-none text-gray-700 dark:text-gray-200 w-5 h-5 flex items-center justify-center rounded bg-black/10 dark:bg-white/10" title="Use regular expressions">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <text x="4" y="18" fontFamily="monospace" fontSize="17px" fontWeight="bold">.</text>
              <text x="11" y="18" fontFamily="monospace" fontSize="17px">*</text>
            </svg>
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none z-10 whitespace-nowrap">
            Use regular expressions
          </span>
        </label>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
          disabled={!isValid}
        >
          Replace All
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {numResultsFound} {numResultsFound === 1 ? "quote" : "quotes"} found
        </span>
      </div>
    </form>
  );
}

export default React.memo(FindReplaceForm);