import { Button, Col, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
import QuoteList from "./components/QuoteList";
import EditModal from "./components/EditModal";
import { useEffect, useState } from "react";
import FindReplaceForm from "./components/FindReplaceForm";
import ConfirmReplaceModal from "./components/ConfirmReplaceModal";
import SubmitQuoteChange from "./utils/QuoteAPIUtils";

interface Props{
  readToken: string,
  editToken: string,
}

const QuoteEditor = ({readToken, editToken}: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [editMade, setEditMade] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [searchRegEx, setSearchRegEx] = useState<RegExp>();
  const [replaceText, setReplaceText] = useState("");
  const [numSubmitting, setNumSubmitting] = useState(-1);
  const [isReloading, setIsReloading] = useState(true);

  const quoteNumber = selectedIndex + 1;
  const isAdd = selectedIndex === items.length;
  const modalTitle = `${isAdd ? "Add" : "Edit"} Quote ${quoteNumber}`;

  useEffect(() => {
    setIsReloading(true);
    fetch(
      `https://corsproxy.io/?url=https://twitch.center/customapi/quote/list?token=${readToken}`
    )
      .then((response) => response.text())
      .then((text) => {
        console.log("fetching quote list");
        setItems(
          text.split("\n").map((item) => item.substring(item.match(/(?<=^[0-9]+\. )/)?.index ?? 0))
        );
        setTimeout(() => setIsReloading(false), 150);
      });
  }, [editMade, readToken]);
  if (items.length === 1 && items[0] === "There are no quotes added") return <h2>No quotes found, make sure you have the correct tokens</h2>

  const handleEditSave = (formData: FormData) => {
    SubmitQuoteChange(editToken, isAdd, `${formData.get("quoteText")}`, quoteNumber).then(
      () => {
        setEditMade((val) => !val);
        setSelectedIndex(-1);
      }
    );
    setShowEditModal(false);
  };

  const handleSelect = (i: number) => {
    setSelectedIndex(i);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setSelectedIndex(-1);
  };

  const handleConfirmReplace = () => {
    const quotesToReplace = items
      .map(
        (entry, i) =>
          {if (searchRegEx?.test(entry)) {return {num: i + 1,  quoteText: entry.replace(searchRegEx, replaceText)}}}
      ).filter((item) => item != undefined);
      setNumSubmitting(0);
    const promises = quotesToReplace.map((quote, i) =>{
      return new Promise((resolve) =>{
        setTimeout(() => {
          resolve(SubmitQuoteChange(editToken, false, quote.quoteText, quote.num).then(() => setNumSubmitting(i+1)));
        }, (400*i) + Math.ceil(Math.random()*200));});
      });

    Promise.all(promises).then(() => {
      setNumSubmitting(quotesToReplace.length);
      setTimeout(() => {
        setShowReplaceModal(false);
        setNumSubmitting(-1);
        setEditMade(val => !val);
      }, 700);
    });
  };

  return (
    <>
      <Row>
        <Col className="my-3" sm={12} md={{ span: 5, order: "last" }} xl={{span: 4, order: "last"}}>
          <h1>Find/Replace</h1>
          <FindReplaceForm
            handleSetRegEx={setSearchRegEx}
            handleReplaceTextChange={setReplaceText}
            handleReplaceClick={() => setShowReplaceModal(true)}
            numResultsFound={items.filter((entry) => {if (searchRegEx !=null) searchRegEx.lastIndex = 0; return searchRegEx?.test(entry)}).length}
          />
        </Col>
        <Col className="my-3" sm={12} md={{ span: 7, order: "first" }} xl={{span: 8, order: "first"}}>
          <Row className="align-items-end">
            <Col xs="auto"><h1>Quotes</h1></Col>
            {isReloading && <Col className="px-0 mb-2" xs="auto"><Spinner as={"span"} animation="border"/></Col>}
            <Col xs className="text-end">
              <OverlayTrigger placement="auto" delay={120} overlay={<Tooltip>Refresh Quote List</Tooltip>}>
                <Button className="mb-2 border" variant="outline" onClick={() => setEditMade(val => !val)}>↻</Button>
              </OverlayTrigger>
            </Col>
          </Row>
          <QuoteList
            items={items}
            searchPattern={searchRegEx}
            replaceText={replaceText}
            handleSelect={handleSelect}
            selectedIndex={selectedIndex}
          />
          <Button className="my-3" onClick={() => handleSelect(items.length)}>
            New Quote
          </Button>
        </Col>
      </Row>

      <EditModal
        showModal={showEditModal}
        modalTitle={modalTitle}
        existingQuoteText={items[selectedIndex]}
        handleClose={handleEditClose}
        handleSave={handleEditSave}
      />
      <ConfirmReplaceModal
        showModal={showReplaceModal}
        items={items}
        searchPattern={searchRegEx}
        replaceText={replaceText}
        numSubmitting={numSubmitting}
        handleClose={() => setShowReplaceModal(false)}
        handleSave={handleConfirmReplace}
      ></ConfirmReplaceModal>
    </>
  );
};

export default QuoteEditor;
