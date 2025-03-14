import { useEffect, useState } from "react";
import escapeStringRegexp from "escape-string-regexp";
import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
interface Props {
  handleSetRegEx: (searchRegEx: RegExp | undefined) => void;
  handleReplaceTextChange: (replaceText: string) => void;
  handleReplaceClick: () => void;
  isResultFound: boolean;
}

export default function FindReplaceForm({
  handleSetRegEx,
  handleReplaceTextChange: handleReplaceChange,
  handleReplaceClick,
  isResultFound,
}: Props) {
  const [isValidRegex, setIsValidRegex] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [isUsingRegex, setIsUsingRegex] = useState(false);
  const [isMatchingWholeWords, setIsMatchingWholeWords] = useState(false);
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);

  useEffect(() => {
    if (searchString) {
      try {
        let pattern = isUsingRegex ? searchString : escapeStringRegexp(searchString);
        pattern = isMatchingWholeWords ? `\\b${pattern}\\b` : pattern;
        const regex = new RegExp(pattern, isCaseSensitive ? "g" : "gi");
        setIsValidRegex(true);
        handleSetRegEx(regex);
      } catch {
        setIsValidRegex(false);
        handleSetRegEx(undefined);
      }
    } else {
      setIsValidRegex(false);
      handleSetRegEx(undefined);
    }
  }, [
    handleSetRegEx,
    searchString,
    isUsingRegex,
    isMatchingWholeWords,
    isCaseSensitive,
  ]);
  
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleReplaceClick();
  }

  const isValid = isValidRegex && isResultFound;
  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row>
        <Form.Label column xs="auto">
          Find
        </Form.Label>
        <Col xs className="col-form-label text-end">
          <OverlayTrigger overlay={<Tooltip>Match Case</Tooltip>}>
            <span>
              <Form.Check
                inline
                id="matchCase"
                label=<samp>Aa</samp>
                onChange={(e) => setIsCaseSensitive(e.target.checked)}
              />
            </span>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Match Whole Word</Tooltip>}>
            <span>
              <Form.Check
                inline
                id="matchWholeWord"
                label=<samp className="border rounded-bottom-1 border-top-0">
                  ab
                </samp>
                onChange={(e) => setIsMatchingWholeWords(e.target.checked)}
              />
            </span>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>Use Regular Expression</Tooltip>}>
            <span>
              <Form.Check
                inline
                id="matchUsingRegex"
                label=<samp>.*</samp>
                onChange={(e) => setIsUsingRegex(e.target.checked)}
              />
            </span>
          </OverlayTrigger>
        </Col>
      </Row>
      <Form.Group className="pb-2 mb-4 position-relative" controlId="formTextControl">
        <Form.Control
          required
          name="findText"
          inputMode="search"
          placeholder="Search Pattern"
          autoComplete="off"
          onChange={(e) => setSearchString(e.target.value)}
          isInvalid={!isValid}
        />
        <Form.Control.Feedback className="position-absolute" type="invalid">
          {!searchString ? "Enter a search pattern" : !isValidRegex ? "Invalid RegEx" :  "No results found"}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="my-3" controlId="replaceTextControl">
        <Col sm={12} md="auto">
          <Form.Label>Replace With</Form.Label>
        </Col>
        <Col>
          <Form.Control
            name="replaceText"
            inputMode="text"
            autoComplete="off"
            placeholder="Replacement Text"
            onChange={(e) => handleReplaceChange(e.target.value)}
          />
        </Col>
      </Form.Group>
      <Button type="submit" disabled={!isValid}>
        Replace All
      </Button>
    </Form>
  );
}