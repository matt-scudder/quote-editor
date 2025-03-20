import { ListGroup } from "react-bootstrap";
import RenderMatchHighlights from "./MatchHighlighter";
import { useCallback } from "react";
interface Props {
  items: string[];
  searchPattern: RegExp | undefined;
  selectedIndex: number;
  handleSelect: (index: number) => void;
}

function QuoteList({
  items,
  searchPattern,
  selectedIndex,
  handleSelect,
}: Props) {
  const highlightFunc = useCallback((highlight: string) => <mark>{highlight}</mark>, []);
  return (
    <ListGroup numbered>
      {items.map((entry, i) => (
        <ListGroup.Item
          action
          key={i}
          onClick={() => handleSelect(i)}
          active={selectedIndex === i}
        >
          <RenderMatchHighlights quoteText={entry} searchRegEx={searchPattern} highlightFunc={highlightFunc} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default QuoteList;
