import { ListGroup } from "react-bootstrap";
import { RenderMatchHighlights } from "./MatchHighlighter";
interface Props {
  items: string[];
  searchPattern: RegExp | undefined;
  replaceText: string;
  selectedIndex: number;
  handleSelect: (index: number) => void;
}

function QuoteList({
  items,
  searchPattern,
  selectedIndex,
  handleSelect,
}: Props) {
  return (
    <ListGroup numbered>
      {items.map((entry, i) => (
        <ListGroup.Item
          action
          key={i + 1}
          onClick={() => handleSelect(i)}
          active={selectedIndex === i}
        >
          {RenderMatchHighlights(entry, searchPattern, (highlight) => <mark>{highlight}</mark>)}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default QuoteList;
