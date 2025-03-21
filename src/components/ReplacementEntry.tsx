import { Col, Form, ListGroup, Row, Spinner } from 'react-bootstrap'
import { PropsWithChildren } from 'react';

interface Props {
    quoteNum: number;
    isSelected: boolean;
    submittingQuoteNum: number;
    setSelected: (quoteNum: number, isSelected: boolean) => void;
}

const ReplacementEntry = ({quoteNum, isSelected, submittingQuoteNum, setSelected, children}: PropsWithChildren<Props>) => {
  return (
    <ListGroup.Item key={quoteNum} className={isSelected ? "" : "text-muted"}>
      <Row className="align-items-center">
        <Col xs="auto" className="pe-1">{quoteNum}.</Col>
        <Col className="px-2" >
          {children}
        </Col>
        {submittingQuoteNum == quoteNum ? (
          <Col xs="auto"><Spinner size="sm" animation="border" /></Col>
        ) : (
          <Col xs="auto">
            <Form.Check
              disabled={submittingQuoteNum >= 0}
              defaultChecked={isSelected}
              onChange={e => setSelected(quoteNum, e.target.checked)}
            />
          </Col> 
        )}
      </Row>
    </ListGroup.Item>
  )
}

export default ReplacementEntry;