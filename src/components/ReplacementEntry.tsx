import { PropsWithChildren } from 'react';

interface Props {
    quoteNum: number;
    isSelected: boolean;
    submittingQuoteNum: number;
    setSelected: (quoteNum: number, isSelected: boolean) => void;
}

const ReplacementEntry = ({quoteNum, isSelected, submittingQuoteNum, setSelected, children}: PropsWithChildren<Props>) => {
  return (
    <li className={`flex items-center py-2 px-3 ${isSelected ? '' : 'text-muted'}`} key={quoteNum}>
      <span className="mr-2 w-8 text-right text-gray-500">{quoteNum}.</span>
      <div className="flex-1 px-2">{children}</div>
      {submittingQuoteNum == quoteNum ? (
        <span className="ml-2">
          <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </span>
      ) : (
        <input
          type="checkbox"
          className="ml-2"
          disabled={submittingQuoteNum >= 0}
          defaultChecked={isSelected}
          onChange={e => setSelected(quoteNum, e.target.checked)}
        />
      )}
    </li>
  )
}

export default ReplacementEntry;