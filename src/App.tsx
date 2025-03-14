import { Container } from "react-bootstrap";
import QuoteEditor from "./QuoteEditor";

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const readToken = searchParams.get("readToken");
  const editToken = searchParams.get("editToken");
  const hasParams = readToken && editToken;
  return (
    <Container fluid="lg">
      {hasParams ? (
        <QuoteEditor readToken={readToken} editToken={editToken} />
      ) : (
        <h1>
          <code>readToken</code> and <code>editToken</code> must be given as search parameters
        </h1>
      )}
    </Container>
  );
}

export default App;
