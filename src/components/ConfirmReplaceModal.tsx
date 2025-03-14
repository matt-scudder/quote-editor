import { Button, Col, Form, ListGroup, Modal, ProgressBar, Row, Spinner } from "react-bootstrap";
import { RenderMatchHighlights } from "./MatchHighlighter";
import { useEffect, useState } from "react";

interface Props {
  showModal: boolean;
  items: string[];
  searchPattern: RegExp | undefined;
  replaceText: string;
  submittingInfo: {current: number, total: number};
  handleClose: () => void;
  handleSave: (selectedQuotes: {quoteText: string, quoteNumber: number}[]) => void;
}

function ConfirmReplaceModal({
  showModal,
  items,
  searchPattern,
  replaceText,
  submittingInfo,
  handleClose,
  handleSave,
}: Props) {
  type ReplaceableQuote = {
    quoteText: string;
    quoteNumber: number;
    isSelected: boolean;
  }

  const saveSelected = (quotes: ReplaceableQuote[]) => {
    handleSave(quotes.filter(rq => rq.isSelected)
    .map(rq => {return {quoteText: rq.quoteText, quoteNumber: rq.quoteNumber}}))
  }

  const [isSelectedArray, setIsSelectedArray] = useState(new Array(items.length).fill(true));
  useEffect(() => {
    setIsSelectedArray(new Array(items.length).fill(true));
  }, [items, showModal]);

  const replaceableQuotes :ReplaceableQuote[] = items.map((entry, i) =>{
    searchPattern!.lastIndex = 0;
    if (searchPattern?.test(entry)){
      return {quoteNumber:i+1, quoteText: entry, isSelected: isSelectedArray[i]}
    }
  }).filter<ReplaceableQuote>(x => x != undefined);
  const numSubmitting = replaceableQuotes.filter(rq => rq.isSelected).length;

  return showModal && (
    <Modal show={showModal} size="lg" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Quote Replacements</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {replaceableQuotes.map(({quoteNumber, quoteText, isSelected}: ReplaceableQuote) => {
                return (
                <ListGroup.Item key={quoteNumber} className={isSelected ? "" : "text-muted"}>
                  <Row className="align-items-center">
                    <Col xs="auto" className="pe-1">{quoteNumber}.</Col>
                    <Col className="px-2" >
                      <span className="font-monospace">- </span>
                      {RenderMatchHighlights(quoteText, searchPattern, (text) => (
                        isSelected ? <span className="text-bg-danger">{text}</span> : text
                      ))}
                      <hr className="m-0" />
                      <span className="font-monospace">+ </span>
                      {RenderMatchHighlights(quoteText, searchPattern, (text) => (
                        isSelected ? <span className="text-bg-primary bg-gradient">{replaceText}</span> : text
                      ))}
                    </Col>
                    {submittingInfo.current == quoteNumber ? 
                    ( <Col xs="auto"><Spinner size="sm" animation="border" /></Col> ) 
                    :
                    ( 
                      <Col xs="auto"><Form.Check disabled={submittingInfo.total >= 0} defaultChecked={isSelected} onChange={e => setIsSelectedArray(isSelectedArray.map((v,idx) => idx === quoteNumber-1 ? e.target.checked : v))}/></Col> 
                    )}
                  </Row>
                </ListGroup.Item>
              )}
            )}
        </ListGroup>
        

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={() => saveSelected(replaceableQuotes)}>Submit Changes</Button>
      </Modal.Footer>
      {submittingInfo.total >= 0 && <ProgressBar className="m-2" animated now={submittingInfo.total*100/numSubmitting}></ProgressBar>}
    </Modal>
  );
}

export default ConfirmReplaceModal;
