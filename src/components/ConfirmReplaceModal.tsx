import { Button, ListGroup, Modal, ProgressBar } from "react-bootstrap";
import { useCallback } from "react";
import RenderMatchHighlights from "./MatchHighlighter";
import ReplacementEntry from "./ReplacementEntry";
import QuoteAPIUtils from "../utils/QuoteAPIUtils";
import { ReplaceableQuote, useQuoteReplacementLogic } from "./QuoteReplacementLogic";

interface Props {
  quoteList: string[];
  searchPattern: RegExp;
  replaceText: string;
  quoteApi: QuoteAPIUtils;
  hideModal: () => void;
  refreshQuotes: () => void;
}

function ConfirmReplaceModal({quoteList, searchPattern, replaceText, quoteApi, hideModal, refreshQuotes}:Props) {
  const {
    replaceableQuotes,
    submittingQuoteNum,
    totalSubmitted,
    totalToSubmit,
    handleReplace,
    setSelected,
  } = useQuoteReplacementLogic({quoteList, searchPattern, replaceText, quoteApi, hideModal, refreshQuotes});

  const removalHighlightFunc = useCallback(
    (text: string) => <span className="text-bg-danger">{text}</span>,
    []
  );
  const replacementHightlightFunc = useCallback(
    () => <span className="text-bg-primary bg-gradient">{replaceText}</span>,
    [replaceText]
  );

  function renderQuoteDiff(quote: ReplaceableQuote, searchPattern: RegExp) {
    return (
      <>
        <span className="font-monospace">- </span>
        {quote.isSelected ? (
          <RenderMatchHighlights quoteText={quote.quoteText} searchRegEx={searchPattern} highlightFunc={removalHighlightFunc} />
        ) : (
          quote.quoteText
        )}
        <hr className="m-0" />
        <span className="font-monospace">+ </span>
        {quote.isSelected ? (
          <RenderMatchHighlights quoteText={quote.quoteText} searchRegEx={searchPattern} highlightFunc={replacementHightlightFunc} />
        ) : (
          quote.quoteText
        )}
      </>
    );
  };

  return (
    <Modal show size="lg" onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Quote Replacements</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {replaceableQuotes.map((rq: ReplaceableQuote) => (
            <ReplacementEntry
              quoteNum={rq.quoteNumber}
              isSelected={rq.isSelected}
              submittingQuoteNum={submittingQuoteNum}
              setSelected={setSelected}
            >
              {renderQuoteDiff(rq, searchPattern)}
            </ReplacementEntry>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Cancel
        </Button>
        <Button disabled={totalToSubmit === 0} onClick={handleReplace}>
          Submit Changes
        </Button>
      </Modal.Footer>
      {totalSubmitted >= 0 && (
        <ProgressBar
          className="m-2"
          animated
          now={(totalSubmitted * 100) / totalToSubmit}
        />
      )}
    </Modal>
  );
}

export default ConfirmReplaceModal;
