import { ReactNode } from "react";

export function RenderMatchHighlights(
  entry: string,
  searchRegEx: RegExp | undefined,
  highlightFunc: (text: string) => ReactNode
): ReactNode[] {
  const nodes = new Array<ReactNode>();
  let cursor = 0;
  if (searchRegEx) {
    searchRegEx.lastIndex = 0;
    for (const match of entry.matchAll(searchRegEx)) {
      if (match.index > cursor) {
        nodes.push(entry.substring(cursor, match.index));
      }
      nodes.push(highlightFunc(match[0]));
      cursor = match.index + match[0].length;
    }
  }
  if (cursor < entry.length) {
    nodes.push(entry.substring(cursor));
  }
  return nodes;
}
