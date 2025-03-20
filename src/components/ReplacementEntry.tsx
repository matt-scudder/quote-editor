import { Col, Form, ListGroup, Row, Spinner } from 'react-bootstrap'
import { SetStateAction, useCallback } from "react";
import RenderMatchHighlights from "./MatchHighlighter"
import { ReplaceableQuote } from './ConfirmReplaceModal';

interface Props {
    quote: ReplaceableQuote;
    searchPattern: RegExp | undefined;
    replaceText: string;
    currentSubmittingIndex: number;
    setReplaceableQuotes: (quotes: SetStateAction<ReplaceableQuote[]>) => void;
}

const ReplacementEntry = ({quote, searchPattern, replaceText, currentSubmittingIndex, setReplaceableQuotes}: Props) => {
  const removalHighlightFunc = useCallback((text: string) => <span className="text-bg-danger">{text}</span>, []);
  const replacementHightlightFunc = useCallback(() => <span className="text-bg-primary bg-gradient">{replaceText}</span>, [replaceText]);

  return (
    <ListGroup.Item key={quote.quoteNumber} className={quote.isSelected ? "" : "text-muted"}>
      <Row className="align-items-center">
        <Col xs="auto" className="pe-1">{quote.quoteNumber}.</Col>
        <Col className="px-2" >
          <span className="font-monospace">- </span>
          {quote.isSelected ?
            <RenderMatchHighlights quoteText={quote.quoteText} searchRegEx={searchPattern} highlightFunc={removalHighlightFunc} />
          : quote.quoteText}
          <hr className="m-0" />
          <span className="font-monospace">+ </span>
          {quote.isSelected ? 
            <RenderMatchHighlights quoteText={quote.quoteText} searchRegEx={searchPattern} highlightFunc={replacementHightlightFunc} />
          : quote.quoteText }
        </Col>
        {currentSubmittingIndex == quote.quoteNumber ? ( 
          <Col xs="auto"><Spinner size="sm" animation="border" /></Col>
        ) : (
          <Col xs="auto">
            <Form.Check
              disabled={currentSubmittingIndex >= 0}
              defaultChecked={quote.isSelected}
              onChange={e =>
                setReplaceableQuotes(rqlist => rqlist.map((rq) => rq.quoteNumber === quote.quoteNumber ? {...rq, isSelected: e.target.checked} : rq))
              }
            />
          </Col> 
        )}
      </Row>
    </ListGroup.Item>
  )
}

export default ReplacementEntry;