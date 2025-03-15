import { Alert, Container } from "react-bootstrap";
import QuoteEditor from "./QuoteEditor";
import TokenInputForm from "./components/TokenInputForm";
import { useState } from "react";

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const [readToken, setReadToken] = useState(searchParams.get("readToken"));
  const [editToken, setEditToken] = useState(searchParams.get("editToken"));
  const [hasTokenError, setHasTokenError] = useState(false);
  const showQuoteEditor = readToken && editToken && !hasTokenError;
  return (
    <Container fluid="lg">
      {showQuoteEditor ? (
        <QuoteEditor readToken={readToken} editToken={editToken} setHasTokenError={setHasTokenError}/>
      ) : (
        <>{hasTokenError && 
            <Alert className="my-3" variant="danger">
              <Alert.Heading>Token Error!</Alert.Heading>
              <p>The given tokens returned no quotes, or no quotes have been added.</p>
              <p>See the <Alert.Link href="https://community.nightdev.com/t/customapi-quote-system/7871">info page for the quote system</Alert.Link> to set up a new one.</p>
            </Alert>
          }
          <TokenInputForm
            submitTokens={(readToken: string, editToken: string) => {
              setReadToken(readToken);
              setEditToken(editToken);
            }}
          />
        </>
      )}
    </Container>
  );
}

export default App;
