import { useRef, useEffect } from "react";
import BaseModal from "./BaseModal"; // Import the BaseModal

interface Props {
  handleClose: () => void;
  handleSave: (formData: FormData) => void;
}

const AddModal = ({ handleClose, handleSave }: Props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <BaseModal onClose={handleClose} title="Add Quote">
      <form className="p-4" onSubmit={e => {e.preventDefault(); handleSave(new FormData(e.currentTarget));}}>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100" htmlFor="add-quote-text">
            Quote Text
          </label>
          <textarea
            id="add-quote-text"
            name="quoteText"
            autoComplete="off"
            required
            ref={inputRef}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-shadow resize-none overflow-hidden"
            style={{ minHeight: '2.5rem' }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button 
            type="button" 
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200" 
            onClick={handleClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default AddModal;
