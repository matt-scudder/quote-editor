import { useCallback } from "react";
import BaseModal from "./BaseModal"; // Import the BaseModal
import RenderMatchHighlights from "./MatchHighlighter";
import ReplacementEntry from "./ReplacementEntry";
import { ReplaceableQuote, useQuoteReplacementLogic } from "./QuoteReplacementLogic";

interface Props {
  quoteList: string[];
  searchPattern: RegExp;
  replaceText: string;
  hideModal: () => void;
  refreshQuotes: () => void;
}

function ConfirmReplaceModal({quoteList, searchPattern, replaceText, hideModal, refreshQuotes}:Props) {
  const {
    replaceableQuotes,
    submittingQuoteNum,
    totalSubmitted,
    totalToSubmit,
    handleReplace,
    setSelected,
  } = useQuoteReplacementLogic({quoteList, searchPattern, replaceText, hideModal, refreshQuotes});

  const removalHighlightFunc = useCallback(
    (text: string) => <span className="bg-red-200 dark:bg-red-900/60 text-red-700 dark:text-red-200 px-1 rounded-sm">{text}</span>,
    []
  );
  const replacementHightlightFunc = useCallback(
    () => <span className="bg-blue-200 dark:bg-blue-900/60 text-blue-700 dark:text-blue-200 px-1 rounded-sm">{replaceText}</span>,
    [replaceText]
  );

  function renderQuoteDiff(quote: ReplaceableQuote, searchPattern: RegExp) {
    const unselectedClass = !quote.isSelected ? "text-gray-400 dark:text-gray-500" : "";
    return (
      <>
        <div> {/* Removed background and text color classes */}
          <span className="font-mono select-none">- </span>
          {quote.isSelected ? (
            <RenderMatchHighlights quoteText={quote.quoteText} searchRegEx={searchPattern} highlightFunc={removalHighlightFunc} />
          ) : (
            <span className={unselectedClass}>{quote.quoteText}</span>
          )}
        </div>
        <hr className="my-1 border-gray-300 dark:border-gray-600" />
        <div> {/* Removed background and text color classes */}
          <span className="font-mono select-none">+ </span>
          {quote.isSelected ? (
            <RenderMatchHighlights quoteText={quote.quoteText} searchRegEx={searchPattern} highlightFunc={replacementHightlightFunc} />
          ) : (
            <span className={unselectedClass}>{quote.quoteText}</span>
          )}
        </div>
      </>
    );
  };

  const progress = totalToSubmit > 0 ? (totalSubmitted * 100) / totalToSubmit : 0;

  return (
    <BaseModal onClose={hideModal} title="Confirm Quote Replacements">
      <div className="p-4">
        <div className="mb-4">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded max-h-96 overflow-y-auto">
            {replaceableQuotes.map((rq: ReplaceableQuote) => (
              <li key={rq.quoteNumber} className="py-1 px-2 text-sm">
                <ReplacementEntry
                  quoteNum={rq.quoteNumber}
                  isSelected={rq.isSelected}
                  submittingQuoteNum={submittingQuoteNum}
                  setSelected={setSelected}
                >
                  {renderQuoteDiff(rq, searchPattern)}
                </ReplacementEntry>
              </li>
            ))}
          </ul>
        </div>
        {totalSubmitted > 0 && (
          <div className="mb-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded">
              <div className="bg-blue-500 h-2 rounded" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {progress.toFixed(0)}% complete
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button 
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200" 
            onClick={hideModal}
          >
            Cancel
          </button>
          <button 
            type="button"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50" 
            onClick={handleReplace} 
            disabled={totalToSubmit === 0}
          >
            {totalSubmitted > 0 ? 'Replacing...' : 'Submit Changes'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

export default ConfirmReplaceModal;
