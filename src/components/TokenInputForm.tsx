import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap'

interface Props {
    submitTokens: (readToken: string, editToken: string) => void;
}
const TokenInputForm = ({ submitTokens }: Props) => {
    const [readToken, setReadToken] = useState("");
    const [editToken, setEditToken] = useState("");

    const isValidReadToken = (token: string) => (token.match(/^[A-z|0-9]{8}$/) != null);
    const isValidEditToken = (token: string) => (token.match(/^[A-z|0-9]{16}$/) != null);
    const isInputValid = () => isValidReadToken(readToken) && isValidEditToken(editToken);

  return (
    <>
    <h2>Enter read and edit tokens</h2>
    <Form onSubmit={(e) => {e.preventDefault(); submitTokens(readToken, editToken)}}>
        <Row>
            <Col sm={5}>
                <Form.Group className='pb-2 mb-4 position-relative'>
                    <Form.Label>Read Token</Form.Label>
                    <Form.Control type='username' autoComplete='username' onChange={e => setReadToken(e.target.value)} isInvalid={!isValidReadToken(readToken)}/>
                    <Form.Control.Feedback className='position-absolute' type="invalid">Not a valid read token.</Form.Control.Feedback>
                </Form.Group>
            </Col>
            <Col sm={7}>
                <Form.Group className='pb-2 mb-4 position-relative'>
                    <Form.Label>Edit Token</Form.Label>
                    <Form.Control type='password' autoComplete='current-password' onChange={e => setEditToken(e.target.value)} isInvalid={!isValidEditToken(editToken)}/>
                    <Form.Control.Feedback className='position-absolute' type="invalid">Not a valid edit token.</Form.Control.Feedback>
                </Form.Group>
            </Col>
        </Row>
        <Button type='submit' disabled={!isInputValid()}>Load Quote Editor</Button>
        <Button className='mx-3' variant='outline-warning' disabled={!isInputValid()} href={`?readToken=${readToken}&editToken=${editToken}`}>Load with Permalink</Button>
    </Form>
    </>
  )
}

export default TokenInputForm