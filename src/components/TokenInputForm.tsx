import { useState } from 'react';

interface Props {
    submitTokens: (readToken: string, editToken: string) => void;
    apiName: string;
}
const TokenInputForm = ({ submitTokens, apiName }: Props) => {
    const [readToken, setReadToken] = useState("");
    const [editToken, setEditToken] = useState("");

    const isValidReadToken = (token: string) => (token.match(/^[A-z|0-9]{8}$/) != null);
    const isValidEditToken = (token: string) => (token.match(/^[A-z|0-9]{16}$/) != null);
    const isInputValid = () => isValidReadToken(readToken) && isValidEditToken(editToken);

  return (
    <>
    <h2 className="text-xl font-semibold mb-4">Enter read and edit tokens</h2>
    <form className="space-y-4" onSubmit={(e) => {e.preventDefault(); submitTokens(readToken, editToken)}}>
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
                <label className="block font-medium mb-1">Read Token</label>
                <input type='text' autoComplete='username' onChange={e => setReadToken(e.target.value)}
                  className={`w-full rounded border px-3 py-2 ${readToken && !isValidReadToken(readToken) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {readToken && !isValidReadToken(readToken) && (
                  <div className="text-red-500 text-xs mt-1">Not a valid read token.</div>
                )}
            </div>
            <div className="flex-1">
                <label className="block font-medium mb-1">Edit Token</label>
                <input type='password' autoComplete='current-password' onChange={e => setEditToken(e.target.value)}
                  className={`w-full rounded border px-3 py-2 ${editToken && !isValidEditToken(editToken) ? 'border-red-500' : 'border-gray-300'}`}
                />
                {editToken && !isValidEditToken(editToken) && (
                  <div className="text-red-500 text-xs mt-1">Not a valid edit token.</div>
                )}
            </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button type='submit' disabled={!isInputValid()} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Load Quote Editor</button>
          <a className={`px-4 py-2 rounded border border-yellow-400 text-yellow-700 bg-yellow-100 disabled:opacity-50 ${!isInputValid() ? 'pointer-events-none opacity-50' : ''}`} href={`?readToken=${readToken}&editToken=${editToken}&api=${apiName}`}>Load with Permalink</a>
        </div>
    </form>
    </>
  )
}

export default TokenInputForm