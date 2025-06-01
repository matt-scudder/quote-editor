import BaseModal from "./BaseModal"; // Import the BaseModal

interface Props {
    quoteText: string,
    quoteNumber: number,
    handleClose: () => void;
    handleDelete: () => void;
}

function ConfirmDeleteModal({quoteText, quoteNumber, handleClose, handleDelete }: Props) {
    return (
        <BaseModal onClose={handleClose} title={`Delete Quote #${quoteNumber}`}>
            <div className="p-4">
                <p className="mb-4 dark:text-gray-200">Are you sure you want to delete this quote?</p>
                <div className="mb-4 p-2 bg-gray-100 rounded text-sm dark:bg-gray-700 dark:text-gray-200 break-all whitespace-pre-wrap">{quoteText}</div>
                <div className="flex justify-end gap-2 mt-4">
                    <button 
                        type="button"
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200" 
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-200" 
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}

export default ConfirmDeleteModal;