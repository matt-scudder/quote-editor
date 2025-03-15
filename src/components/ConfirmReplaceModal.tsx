import { Button, Col, ListGroup, Modal, ProgressBar, Row, Spinner } from "react-bootstrap";
import { RenderMatchHighlights } from "./MatchHighlighter";

interface Props {
  showModal: boolean;
  items: string[];
  searchPattern: RegExp | undefined;
  replaceText: string;
  numSubmitting: number;
  handleClose: () => void;
  handleSave: () => void;
}

function ConfirmReplaceModal({
  showModal,
  items,
  searchPattern,
  replaceText,
  numSubmitting,
  handleClose,
  handleSave,
}: Props) {
  let numReplacing = 0;
  return showModal && (
    <Modal show={showModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Quote Replacements</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {items.map(
            (entry, i) => {
              if (searchPattern?.test(entry)) {
                numReplacing++;
                return (
                <ListGroup.Item key={i+1}>
                  <Row className="align-items-center">
                    <Col xs="auto">{i+1}.</Col>
                    <Col className="px-2">
                      <span className="font-monospace">- </span>
                      {RenderMatchHighlights(entry, searchPattern, (text) => (
                        <span className="text-bg-danger">{text}</span>
                      ))}
                      <hr className="m-0" />
                      <span className="font-monospace">+ </span>
                      {RenderMatchHighlights(entry, searchPattern, () => (
                        <span className="text-bg-primary bg-gradient">{replaceText}</span>
                      ))}
                    </Col>
                    {numSubmitting == numReplacing && <Col xs="auto"><Spinner size="sm" animation="border" /></Col>}
                  </Row>
                </ListGroup.Item>
              );}
            })}
        </ListGroup>
        

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Submit Changes</Button>
      </Modal.Footer>
      {numSubmitting >= 0 && <ProgressBar className="m-2" animated now={numSubmitting*100/numReplacing}></ProgressBar>}
    </Modal>
  );
}

export default ConfirmReplaceModal;
