import { useCallback, useContext, useMemo, useState } from "react";
import QuoteAPIUtils from "../utils/QuoteAPIUtils";

export type ReplaceableQuote = {
  quoteText: string;
  quoteNumber: number;
  isSelected: boolean;
};

interface Props {
  quoteList: string[];
  searchPattern: RegExp;
  replaceText: string;
  hideModal: () => void;
  refreshQuotes: () => void;
}

export function useQuoteReplacementLogic({
  quoteList,
  searchPattern,
  replaceText,
  hideModal,
  refreshQuotes,
}: Props) {
  const quoteApi: QuoteAPIUtils = useContext(QuoteAPIUtils.ApiContext)!;
  const [submittingQuoteNum, setSubmittingQuoteNum] = useState(-1);
  const [currentSubmittingTotal, setCurrentSubmittingTotal] = useState(-1);
  const [replaceableQuotes, setReplaceableQuotes] = useState<ReplaceableQuote[]>(
    quoteList.map((quoteText, i) => {
        searchPattern!.lastIndex = 0;
        if (searchPattern?.test(quoteText)) {
          return { quoteNumber: i + 1, quoteText: quoteText, isSelected: true };
        }
      }).filter<ReplaceableQuote>((x) => x != undefined)
  );
  
  const setSelected = useCallback(
    (quoteNum: number, isSelected: boolean) =>
      setReplaceableQuotes((rqlist) =>
        rqlist.map((rq) =>
          rq.quoteNumber === quoteNum ? { ...rq, isSelected: isSelected } : rq
        )
      ),
    []
  );

  const totalToSubmit = useMemo(
    () => replaceableQuotes.filter((rq) => rq.isSelected).length,
    [replaceableQuotes]
  );

  const handleConfirmReplace = () => {
    const quotesToReplace = replaceableQuotes.filter((quote) => quote.isSelected);
    setCurrentSubmittingTotal(0);
    const promises = quotesToReplace.map((q, i) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setSubmittingQuoteNum(q.quoteNumber);
          resolve(
            quoteApi
              .submitEditQuote(
                q.quoteNumber,
                q.quoteText.replace(searchPattern!, replaceText)
              )
              .then(() => setCurrentSubmittingTotal(i + 1))
          );
        }, 400 * i);
      });
    });

    Promise.all(promises).then(() => {
      setTimeout(() => setSubmittingQuoteNum(-1), 250);
      setTimeout(() => {
        hideModal();
        setCurrentSubmittingTotal(-1);
        refreshQuotes();
      }, 700);
    });
  };

  return {
    replaceableQuotes: replaceableQuotes,
    submittingQuoteNum: submittingQuoteNum,
    totalSubmitted: currentSubmittingTotal,
    totalToSubmit: totalToSubmit,
    handleReplace: handleConfirmReplace,
    setSelected: setSelected,
  };
}