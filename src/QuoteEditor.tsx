import { Button, Col, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import QuoteList from "./components/QuoteList";
import EditModal from "./components/EditModal";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import FindReplaceForm from "./components/FindReplaceForm";
import ConfirmReplaceModal from "./components/ConfirmReplaceModal";
import QuoteAPIUtils from "./utils/QuoteAPIUtils";

interface Props{
  setHasTokenError: (hadError: boolean) => void;
}

const QuoteEditor = ({setHasTokenError}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [editMade, setEditMade] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [searchRegEx, setSearchRegEx] = useState<RegExp>();
  const [replaceText, setReplaceText] = useState("");
  const [isReloading, setIsReloading] = useState(true);

  const quoteNumber = selectedIndex + 1;
  const isAdd = selectedIndex === items.length;
  const modalTitle = `${isAdd ? "Add" : "Edit"} Quote ${quoteNumber}`;

  const numResultsFound = useMemo(
    () => searchRegEx === undefined ? 0 : items.filter((entry) =>
      {searchRegEx.lastIndex = 0; return searchRegEx?.test(entry)}).length,
    [items, searchRegEx]
  );
  const refreshQuotes = useCallback(() => setEditMade(val => !val), []);
  const quoteAPI: QuoteAPIUtils = useContext(QuoteAPIUtils.ApiContext)!;

  useEffect(() => {
    setIsReloading(true);
    quoteAPI.getQuoteList().then((items) => {
        setItems(items);
        setTimeout(() => setIsReloading(false), 150);
      });
  }, [editMade, quoteAPI]);

  if (items.length === 1 && items[0] === "There are no quotes added") { 
    setHasTokenError(true);
  }

  const handleEditSave = (formData: FormData) => {
    const quoteText = `${formData.get("quoteText")}`;
    const response = isAdd ? (
        quoteAPI.submitAddQuote(quoteText)
      ) : (
        quoteAPI.submitEditQuote(quoteNumber, quoteText)
      );
    response.then(
      () => {
        refreshQuotes();
        setSelectedIndex(-1);
      }
    );
    setShowEditModal(false);
  };

  const handleQuoteSelect = (i: number) => {
    setSelectedIndex(i);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setSelectedIndex(-1);
  };

  return (
    <>
      <Row>
        <Col className="my-3" sm={12} md={{ span: 5, order: "last" }} xl={{span: 4, order: "last"}}>
          <h1>Find/Replace</h1>
          <FindReplaceForm
            handleSetRegEx={setSearchRegEx}
            handleReplaceTextChange={setReplaceText}
            setShowReplaceModal={setShowReplaceModal}
            numResultsFound={numResultsFound}
          />
        </Col>
        <Col className="my-3" sm={12} md={{ span: 7, order: "first" }} xl={{span: 8, order: "first"}}>
          <Row className="align-items-end">
            <Col xs="auto"><h1>Quotes</h1></Col>
            {isReloading && <Col className="px-0 mb-2" xs="auto"><Spinner as={"span"} animation="border"/></Col>}
            <Col xs className="text-end">
              <OverlayTrigger placement="auto" delay={120} overlay={<Tooltip>Refresh Quote List</Tooltip>}>
                <Button className="mb-2 border" variant="outline" onClick={refreshQuotes}>↻</Button>
              </OverlayTrigger>
            </Col>
          </Row>
          <QuoteList
            items={items}
            searchPattern={searchRegEx}
            handleSelect={handleQuoteSelect}
            selectedIndex={selectedIndex}
          />
          <Button className="my-3" onClick={() => handleQuoteSelect(items.length)}>
            New Quote
          </Button>
        </Col>
      </Row>

      {showEditModal && <EditModal
        modalTitle={modalTitle}
        existingQuoteText={items[selectedIndex]}
        handleClose={handleEditClose}
        handleSave={handleEditSave}
      />}
      {showReplaceModal && <ConfirmReplaceModal
        quoteList={items}
        searchPattern={searchRegEx!}
        replaceText={replaceText}
        hideModal={() => setShowReplaceModal(false)}
        refreshQuotes={refreshQuotes}
      />}
    </>
  );
};

export default QuoteEditor;
