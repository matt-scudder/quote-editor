import { Button, Col, Row } from "react-bootstrap";
import QuoteList from "./components/QuoteList";
import EditModal from "./components/EditModal";
import { useEffect, useState } from "react";
import FindReplaceForm from "./components/FindReplaceForm";
import ReplaceModal from "./components/ReplaceModal";
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

  const quoteNumber = selectedIndex + 1;
  const isAdd = selectedIndex === items.length;
  const modalTitle = `${isAdd ? "Add" : "Edit"} Quote ${quoteNumber}`;

  useEffect(() => {
    fetch(
      `https://corsproxy.io/?url=https://twitch.center/customapi/quote/list?token=${readToken}`
    )
      .then((response) => response.text())
      .then((text) => {
        console.log("fetching quote list");
        setItems(
          text.split("\n").map((item) => item.substring(item.indexOf(". ") + 2))
        );
      });
  }, [editMade, readToken]);
  if (items.length === 0) return <h1>Loading Quotes</h1>;

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

  const handleReplace = () => {
    setShowReplaceModal(true);
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
        }, (500*i) + Math.ceil(Math.random()*200));});
      });

    console.log(quotesToReplace);
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
            handleReplaceChange={setReplaceText}
            handleReplace={handleReplace}
            isResultFound={items.some((entry) => {if (searchRegEx !=null) searchRegEx.lastIndex = 0; return searchRegEx?.test(entry)})}
          />
        </Col>
        <Col className="my-3" sm={12} md={{ span: 7, order: "first" }} xl={{span: 8, order: "first"}}>
          <h1>Quotes</h1>
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
      <ReplaceModal
        showModal={showReplaceModal}
        items={items}
        searchPattern={searchRegEx}
        replaceText={replaceText}
        numSubmitting={numSubmitting}
        handleClose={() => setShowReplaceModal(false)}
        handleSave={handleConfirmReplace}
      ></ReplaceModal>
    </>
  );
};

export default QuoteEditor;
