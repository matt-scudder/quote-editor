import {
  Button,
  ListGroup,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import { useMemo, useState } from "react";
import QuoteAPIUtils from "../utils/QuoteAPIUtils";
import ReplacementEntry from "./ReplacementEntry";

export type ReplaceableQuote = {
  quoteText: string;
  quoteNumber: number;
  isSelected: boolean;
};

interface Props {
  items: string[];
  searchPattern: RegExp | undefined;
  replaceText: string;
  quoteApi: QuoteAPIUtils;
  hideModal: () => void;
  refreshQuotes: () => void;
}

function ConfirmReplaceModal({
  items,
  searchPattern,
  replaceText,
  quoteApi,
  hideModal,
  refreshQuotes,
}: Props) {
  const [currentSubmittingIndex, setCurrentSubmittingIndex] = useState(-1);
  const [currentSubmittingTotal, setCurrentSubmittingTotal] = useState(-1);
  const [replaceableQuotes, setReplaceableQuotes] = useState<ReplaceableQuote[]>(
    items.map((entry, i) => {
      searchPattern!.lastIndex = 0;
      if (searchPattern?.test(entry)) {
        return { quoteNumber: i + 1, quoteText: entry, isSelected: true };
      }
    })
    .filter<ReplaceableQuote>((x) => x != undefined)
  );

  const totalToSubmit = useMemo(
    () => replaceableQuotes.filter((rq) => rq.isSelected).length,
    [replaceableQuotes]
  );

  const handleConfirmReplace = () => {
    const quotesToReplace = replaceableQuotes.filter(quote => quote.isSelected);
    setCurrentSubmittingTotal(0);
    const promises = quotesToReplace.map((q, i) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setCurrentSubmittingIndex(q.quoteNumber);
          resolve(
            quoteApi.SubmitEditQuote(
              q.quoteNumber,
              q.quoteText.replace(searchPattern!, replaceText)
            ).then(() => setCurrentSubmittingTotal(i + 1))
          );
        }, 400 * i);
      });
    });

    Promise.all(promises).then(() => {
      setTimeout(() => setCurrentSubmittingIndex(-1), 250);
      setTimeout(() => {
        hideModal();
        setCurrentSubmittingTotal(-1);
        refreshQuotes();
      }, 700);
    });
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
              key={rq.quoteNumber}
              quote={rq}
              searchPattern={searchPattern}
              replaceText={replaceText}
              currentSubmittingIndex={currentSubmittingIndex}
              setReplaceableQuotes={setReplaceableQuotes}
            />
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Cancel
        </Button>
        <Button
          disabled={!replaceableQuotes.some((rq) => rq.isSelected)}
          onClick={handleConfirmReplace}
        >
          Submit Changes
        </Button>
      </Modal.Footer>
      {currentSubmittingTotal >= 0 && (
        <ProgressBar
          className="m-2"
          animated
          now={(currentSubmittingTotal * 100) / totalToSubmit}
        />
      )}
    </Modal>
  );
}

export default ConfirmReplaceModal;
