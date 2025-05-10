import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import RenderMatchHighlights from "./MatchHighlighter";
import { useCallback, useState } from "react";
interface Props {
  items: string[];
  searchPattern: RegExp | undefined;
  selectedIndex: number;
  handleSelect: (index: number) => void;
  handleDelete: (index: number) => void;
  handleSubmitEdit: (replacementQuote: string) => void;
}

function QuoteList({
  items,
  searchPattern,
  selectedIndex,
  handleSelect,
  handleSubmitEdit,
  handleDelete
}: Props) {
  const [editingText, setEditingText] = useState("");
  const highlightFunc = useCallback((highlight: string) => <mark>{highlight}</mark>, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSubmitEdit(editingText);
  }
  return (
    <ListGroup>
      {items.map((entry, i) => (
        <ListGroup.Item
          action
          key={i}
          active={selectedIndex === i}
        >
          <Row className="align-items-center">
            { selectedIndex === i ?
              <Col xs="auto" className="px-1"><Button className="m-0 p-1 border" variant="outline" onClick={() => handleSelect(-1)}>❌</Button></Col> :
              <Col xs="auto" className="pe-1">{i+1}.</Col>
            }
            <Col className="px-2" >
              {selectedIndex === i ? 
              <Form onSubmit={handleSubmit}>
                <Form.Control
                        name="replaceText"
                        inputMode="text"
                        autoComplete="off"
                        defaultValue={entry}
                        onChange={(e) => setEditingText(e.target.value)}
                      />
                </Form> :
                <RenderMatchHighlights quoteText={entry} searchRegEx={searchPattern} highlightFunc={highlightFunc} />
              }
              
            </Col>
            {selectedIndex === i ?
              <Col xs="auto" className="px-1"><Button className="m-0 py-1 px-2 border" variant="outline" onClick={() => handleSubmitEdit(editingText)}>➤</Button></Col> :
              <>
                <Col xs="auto" className="px-1"><Button className="m-0 px-1 py-0 border" variant="outline" onClick={() => handleSelect(i)}>✎</Button></Col>
                <Col xs="auto" className="px-1"><Button className="m-0 p-0 border" variant="outline" onClick={() => handleDelete(i)}>🗑</Button></Col>
              </>
            }

          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default QuoteList;
