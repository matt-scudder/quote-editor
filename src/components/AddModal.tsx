import { Button, Form, Modal } from "react-bootstrap";

interface Props {
  handleClose: () => void;
  handleSave: (formData: FormData) => void;
}

function AddModal({
  handleClose,
  handleSave,
}: Props) {
  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Quote</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form action={handleSave}>
          <Form.Group controlId="editQuoteForm.QuoteText">
            <Form.Label>Quote Text</Form.Label>
            <Form.Control
              name="quoteText"
              type="text"
              autoComplete="off"
              required
            />
            <Form.Control.Feedback type="invalid" tooltip>
              You can not submit an empty quote
            </Form.Control.Feedback>
          </Form.Group>
          <Modal.Footer className="mt-3 px-0 pb-0">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Changes</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddModal;
