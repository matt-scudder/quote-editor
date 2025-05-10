import { Button, Col, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import QuoteList from "./components/QuoteList";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import FindReplaceForm from "./components/FindReplaceForm";
import AddModal from "./components/AddModal"
import ConfirmReplaceModal from "./components/ConfirmReplaceModal";
import QuoteAPIUtils from "./utils/QuoteAPIUtils";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

interface Props{
  setHasTokenError: (hadError: boolean) => void;
}

const QuoteEditor = ({setHasTokenError}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [editMade, setEditMade] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [searchRegEx, setSearchRegEx] = useState<RegExp>();
  const [replaceText, setReplaceText] = useState("");
  const [isReloading, setIsReloading] = useState(true);

  const quoteNumber = selectedIndex + 1;

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

  const handleSubmitEdit = (quoteText: string) => {
    const response = quoteAPI.submitEditQuote(quoteNumber, quoteText);
    response.then(
      () => {
        refreshQuotes();
        setSelectedIndex(-1);
      }
    );
    setShowAddModal(false);
  }

  const handleAddSave = (formData: FormData) => {
    const quoteText = `${formData.get("quoteText")}`;
    const response = quoteAPI.submitAddQuote(quoteText);
    response.then(
      () => {
        refreshQuotes();
        setSelectedIndex(-1);
      }
    );
    setShowAddModal(false);
  };

  const handleAddClose = () => {
    setShowAddModal(false);
    setSelectedIndex(-1);
  };

  const handleQuoteDelete = (i: number) => {
    setSelectedIndex(i);
    setShowDeleteModal(true);
  };

  const handleDeleteSave = () => {
    const response = quoteAPI.submitDeleteQuote(quoteNumber);
    response.then(
      () => {
        refreshQuotes();
        setSelectedIndex(-1);
      }
    );
    setShowDeleteModal(false);
  }

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setSelectedIndex(-1);
    refreshQuotes();
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
            handleSelect={setSelectedIndex}
            handleSubmitEdit={handleSubmitEdit}
            handleDelete={handleQuoteDelete}
            selectedIndex={selectedIndex}
          />
          <Button className="my-3" onClick={() => setShowAddModal(true)}>
            New Quote
          </Button>
        </Col>
      </Row>

      {showAddModal && <AddModal
        handleClose={handleAddClose}
        handleSave={handleAddSave}
      />}
      {showDeleteModal && <ConfirmDeleteModal
        quoteNumber={quoteNumber}
        quoteText={items[selectedIndex]}
        handleClose={handleDeleteClose}
        handleDelete={handleDeleteSave}
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
