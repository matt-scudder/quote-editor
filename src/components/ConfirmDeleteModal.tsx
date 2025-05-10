import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
interface Props {
    quoteText: string,
    quoteNumber: number,
    handleClose: () => void;
    handleDelete: () => void;
  }
function ConfirmDeleteModal(
    { 
        quoteText,
        quoteNumber,
        handleClose,
        handleDelete }: Props )
    {
    return (
        <Modal show onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Quote {quoteNumber}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>{quoteText}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Cancel
                </Button>
                <Button variant="primary" onClick={handleDelete}>
                Confirm Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
    }

export default ConfirmDeleteModal;