import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import QuoteAPIUtils from "./utils/QuoteAPIUtils";
import QuoteList from "./components/QuoteList";
import FindReplaceForm from "./components/FindReplaceForm";
import AddModal from "./components/AddModal";
import ConfirmReplaceModal from "./components/ConfirmReplaceModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

interface Props{
  setHasTokenError: (hadError: boolean) => void;
}

const QuoteEditor = ({setHasTokenError}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [editMade, setEditMade] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [searchRegEx, setSearchRegEx] = useState<RegExp>();
  const [replaceText, setReplaceText] = useState("");
  const [isReloading, setIsReloading] = useState(true);

  const quoteNumber = selectedIndex + 1;

  const numResultsFound = useMemo(
    () => searchRegEx === undefined ? 0 : items.filter((entry) =>
      {searchRegEx.lastIndex = 0; return searchRegEx?.test(entry)}).length,
    [items, searchRegEx]
  );
  const refreshQuotes = useCallback(() => setEditMade(val => !val), []);
  const quoteAPI: QuoteAPIUtils = useContext(QuoteAPIUtils.ApiContext)!;

  useEffect(() => {
    setIsReloading(true);
    quoteAPI.getQuoteList().then((items) => {
        setItems(items);
        setTimeout(() => setIsReloading(false), 150);
      });
  }, [editMade, quoteAPI]);

  if (items.length === 1 && items[0] === "There are no quotes added") { 
    setHasTokenError(true);
  }

  const handleSubmitEdit = (quoteText: string) => {
    const response = quoteAPI.submitEditQuote(quoteNumber, quoteText);
    response.then(
      () => {
        refreshQuotes();
        setSelectedIndex(-1);
      }
    );
    setShowAddModal(false);
  }

  const handleAddSave = (formData: FormData) => {
    const quoteText = `${formData.get("quoteText")}`;
    const response = quoteAPI.submitAddQuote(quoteText);
    response.then(
      () => {
        refreshQuotes();
        setSelectedIndex(-1);
      }
    );
    setShowAddModal(false);
  };

  const handleAddClose = () => {
    setShowAddModal(false);
    setSelectedIndex(-1);
  };

  const handleQuoteDelete = (i: number) => {
    setSelectedIndex(i);
    setShowDeleteModal(true);
  };

  const handleDeleteSave = () => {
    const response = quoteAPI.submitDeleteQuote(quoteNumber);
    response.then(
      () => {
        refreshQuotes();
        setSelectedIndex(-1);
      }
    );
    setShowDeleteModal(false);
  }

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setSelectedIndex(-1);
    refreshQuotes();
  };

  const handleBackToTokenEntry = () => {
    setHasTokenError(false);
    const url = new URL(window.location.href);
    url.search = ""; // Clear all search parameters
    window.history.replaceState({}, document.title, url.toString());
    window.location.reload(); // Reloads the page to reset the state
  };

  return (
    <>
      <div className="flex flex-col md:flex-row-reverse gap-6 my-3">
        <div className="md:w-2/5 xl:w-1/3">
          <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 py-1">Find/Replace</h1>
          <div className="bg-gray-100 dark:bg-gray-800/70 rounded-lg p-4 shadow-sm">
            <FindReplaceForm
              handleSetRegEx={setSearchRegEx}
              handleReplaceTextChange={setReplaceText}
              setShowReplaceModal={setShowReplaceModal}
              numResultsFound={numResultsFound}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-4 gap-2">
            <button 
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200" 
              title="Back to Token Entry" 
              onClick={handleBackToTokenEntry}
            >
              ←
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Quotes</h1>
            {isReloading && <span className="ml-2 animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></span>}
            <div className="flex-1 text-end">
              <button 
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200" 
                title="Refresh Quote List" 
                onClick={refreshQuotes}
              >
                ↻
              </button>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800/70 rounded-lg p-4 shadow-sm">
            <QuoteList
              items={items}
              searchPattern={searchRegEx}
              handleSelect={setSelectedIndex}
              handleSubmitEdit={handleSubmitEdit}
              handleDelete={handleQuoteDelete}
              selectedIndex={selectedIndex}
            />
          </div>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 shadow-sm" 
            onClick={() => setShowAddModal(true)}
          >
            New Quote
          </button>
        </div>
      </div>
      {showAddModal && <AddModal
        handleClose={handleAddClose}
        handleSave={handleAddSave}
      />}
      {showDeleteModal && <ConfirmDeleteModal
        quoteNumber={quoteNumber}
        quoteText={items[selectedIndex]}
        handleClose={handleDeleteClose}
        handleDelete={handleDeleteSave}
      />}
      {showReplaceModal && <ConfirmReplaceModal
        quoteList={items}
        searchPattern={searchRegEx!}
        replaceText={replaceText}
        hideModal={() => setShowReplaceModal(false)}
        refreshQuotes={refreshQuotes}
      />}
    </>
  );
};

export default QuoteEditor;
