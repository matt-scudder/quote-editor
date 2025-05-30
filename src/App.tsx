import { Alert, Container } from "react-bootstrap";
import QuoteEditor from "./QuoteEditor";
import TokenInputForm from "./components/TokenInputForm";
import { useState } from "react";
import QuoteAPIUtils from "./utils/QuoteAPIUtils";
import './App.css'

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const [readToken, setReadToken] = useState(searchParams.get("readToken"));
  const [editToken, setEditToken] = useState(searchParams.get("editToken"));
  const [hasTokenError, setHasTokenError] = useState(false);
  const showQuoteEditor = readToken && editToken && !hasTokenError;

  const renderContent = () => {
    if (showQuoteEditor) {
      const quoteApi = new QuoteAPIUtils(readToken, editToken);
      return (
        <QuoteAPIUtils.ApiContext.Provider value={quoteApi}>
          <QuoteEditor setHasTokenError={setHasTokenError}/>
        </QuoteAPIUtils.ApiContext.Provider>
      );
    } else {
      return (<>{hasTokenError && 
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
          setHasTokenError(false)
        }}
      />
    </>)
    }
  };

  return (
    <Container fluid="lg">
      {renderContent()}
    </Container>
  );
}

export default App;
