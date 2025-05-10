import { createContext } from "react";
import apiSettingsList from "./api_settings.json";

type ApiSettings = {
  "baseEditUrl": string;
  "baseAddUrl": string;
  "baseListUrl": string;
  "baseDeleteUrl": string;
}

export default class QuoteAPIUtils {
  static readonly ApiContext = createContext<QuoteAPIUtils|null>(null);
  readonly #readToken: string;
  readonly #editToken: string;
  readonly #apiSettings: ApiSettings;

  constructor(readToken: string, editToken:string) {
    this.#readToken = readToken;
    this.#editToken = editToken;
    this.#apiSettings = apiSettingsList.apis[0].apiSettings;
  }

  submitEditQuote(quoteNumber: number, replacementQuoteText: string) {
    replacementQuoteText = `${quoteNumber} ${replacementQuoteText}`;
    return this.#submitQuoteChange(this.#apiSettings.baseEditUrl, replacementQuoteText);
  }

  submitAddQuote(newQuoteText: string){
    return this.#submitQuoteChange(this.#apiSettings.baseAddUrl, newQuoteText);
  }

  #submitQuoteChange(baseUrl: string, quoteText: string){
    const params = new URLSearchParams({
      token: this.#editToken,
      data: quoteText,
    })
    const requestUrl = baseUrl + params;
    return fetch(requestUrl, { mode: "no-cors" });
  }

  submitDeleteQuote(quoteNumber: number){
    const params = new URLSearchParams({
      token: this.#editToken,
      data: quoteNumber.toString(),
    })
    const requestUrl = this.#apiSettings.baseDeleteUrl + params;
    return fetch(requestUrl, { mode: "no-cors" });
  }

  async getQuoteList(){
    const params = new URLSearchParams({token: this.#readToken});
    const requestUrl = this.#apiSettings.baseListUrl + params;
    const responseText = await fetch(requestUrl).then(resp => resp.text());
    return responseText.split("\n").map(
      (item) => item.substring(item.match(/(?<=^[0-9]+\. )/)?.index ?? 0)
    );
  }
}
