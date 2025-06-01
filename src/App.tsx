import QuoteEditor from "./QuoteEditor";
import TokenInputForm from "./components/TokenInputForm";
import { useState } from "react";
import QuoteAPIUtils from "./utils/QuoteAPIUtils";
import apiSettingsList from "./utils/api_settings.json";
import DarkModeToggle from "./components/DarkModeToggle";
import './App.css'

function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const [readToken, setReadToken] = useState(searchParams.get("readToken"));
  const [editToken, setEditToken] = useState(searchParams.get("editToken"));
  const [hasTokenError, setHasTokenError] = useState(false);
  const apiParam = searchParams.get("api");
  const initialApi = apiParam
    ? apiSettingsList.apis.find(api => api.apiName === apiParam) || apiSettingsList.apis[0]
    : apiSettingsList.apis[0];
  const [selectedApi, setSelectedApi] = useState(initialApi);
  const showQuoteEditor = readToken && editToken && !hasTokenError;

  const handleApiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const apiName = event.target.value;
    const api = apiSettingsList.apis.find(api => api.apiName === apiName);
    if (api) {
      setSelectedApi(api);
    }
  };

  const renderContent = () => {
    if (showQuoteEditor) {
      const quoteApi = new QuoteAPIUtils(readToken, editToken, selectedApi.apiSettings);
      return (
        <QuoteAPIUtils.ApiContext.Provider value={quoteApi}>
          <QuoteEditor setHasTokenError={setHasTokenError} />
        </QuoteAPIUtils.ApiContext.Provider>
      );
    } else {
      return (
        <>
          <div className="mb-3">
            <label htmlFor="apiSelect" className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">Select API:</label>
            <select 
              id="apiSelect" 
              className="form-select block w-auto rounded-lg border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-200 p-2"
              onChange={handleApiChange}
              value={selectedApi.apiName} // Ensure the select shows the current selectedApi
            >
              {apiSettingsList.apis.map(api => (
                <option key={api.apiName} value={api.apiName} className="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                  {api.apiName}
                </option>
              ))}
            </select>
          </div>
          {hasTokenError && (
            <div className="my-3 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="font-bold mb-2">Token Error!</div>
              <p>The given tokens returned no quotes, or no quotes have been added.</p>
              <p>
                See the <a className="underline text-blue-700" href="https://community.nightdev.com/t/customapi-quote-system/7871">info page for the quote system</a> to set up a new one.
              </p>
            </div>
          )}
          <TokenInputForm
            submitTokens={(readToken: string, editToken: string) => {
              setReadToken(readToken);
              setEditToken(editToken);
              setHasTokenError(false);
            }}
            apiName={selectedApi.apiName}
          />
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      <DarkModeToggle />
      <div className="container mx-auto px-4 py-8 max-w-4xl xl:max-w-6xl">
        <div className="bg-white dark:bg-[#18202F] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
