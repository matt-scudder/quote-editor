import { Container } from "react-bootstrap";
import QuoteEditor from "./QuoteEditor";
import TokenInputForm from "./components/TokenInputForm";
import { useState } from "react";

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const [readToken, setReadToken] = useState(searchParams.get("readToken"));
  const [editToken, setEditToken] = useState(searchParams.get("editToken"));
  const hasParams = readToken && editToken;
  return (
    <Container fluid="lg">
      {hasParams ? (
        <QuoteEditor readToken={readToken} editToken={editToken} />
      ) : (
        <TokenInputForm submitTokens={(readToken:string, editToken: string) => {setReadToken(readToken); setEditToken(editToken)}} />
      )}
    </Container>
  );
}

export default App;
