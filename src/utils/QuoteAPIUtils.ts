import { createContext } from "react";

export default class QuoteAPIUtils {
  static readonly ApiContext = createContext<QuoteAPIUtils|null>(null);
  readonly #readToken: string;
  readonly #editToken: string;
  static readonly #baseEditUrl = "https://twitch.center/customapi/editquote?"
  static readonly #baseAddUrl = "https://twitch.center/customapi/addquote?"
  static readonly #baseListUrl = "https://corsproxy.io/?url=https://twitch.center/customapi/quote/list?"
  // TODO: use "https://twitch.center/customapi/delquote?" for delete

  constructor(readToken: string, editToken:string) {
    this.#readToken = readToken;
    this.#editToken = editToken;
  }

  submitEditQuote(quoteNumber: number, replacementQuoteText: string) {
    replacementQuoteText = `${quoteNumber} ${replacementQuoteText}`;
    return this.#submitQuoteChange(QuoteAPIUtils.#baseEditUrl, replacementQuoteText);
  }

  submitAddQuote(newQuoteText: string){
    return this.#submitQuoteChange(QuoteAPIUtils.#baseAddUrl, newQuoteText);
  }

  #submitQuoteChange(baseUrl: string, quoteText: string){
    const params = new URLSearchParams({
      token: this.#editToken,
      data: quoteText,
    })
    const requestUrl = baseUrl + params;
    return fetch(requestUrl, { mode: "no-cors" });
  }

  async getQuoteList(){
    const params = new URLSearchParams({token: this.#readToken});
    const requestUrl = QuoteAPIUtils.#baseListUrl + params;
    const responseText = await fetch(requestUrl).then(resp => resp.text());
    return responseText.split("\n").map(
      (item) => item.substring(item.match(/(?<=^[0-9]+\. )/)?.index ?? 0)
    );
  }
}
