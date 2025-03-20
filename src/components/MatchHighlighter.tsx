import React from "react";
import { ReactNode } from "react";

interface Props{
  quoteText: string;
  searchRegEx: RegExp | undefined;
  highlightFunc: (text: string) => ReactNode;
}

function RenderMatchHighlights({quoteText, searchRegEx, highlightFunc}: Props) {
  const elementArray = new Array<ReactNode>();
  let cursor = 0;
  if (searchRegEx) {
    searchRegEx.lastIndex = 0;
    for (const match of quoteText.matchAll(searchRegEx)) {
      if (match.index > cursor) {
        elementArray.push(quoteText.substring(cursor, match.index));
      }
      elementArray.push(highlightFunc(match[0]));
      cursor = match.index + match[0].length;
    }
  }
  if (cursor < quoteText.length) {
    elementArray.push(quoteText.substring(cursor));
  }
  return elementArray;
}

export default React.memo(RenderMatchHighlights);