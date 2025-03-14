export default function SubmitQuoteChange(
    editToken: string,
    isAdd: boolean,
    newQuoteText: string,
    quoteNumber: number,
  ): Promise<Response> {
    let requestUrl = `https://twitch.center/customapi/editquote?token=${editToken}&data=`;
    if (isAdd) {
      requestUrl = `https://twitch.center/customapi/addquote?token=${editToken}&data=`;
    } else {
      newQuoteText = `${quoteNumber} ${newQuoteText}`;
    }

    requestUrl = requestUrl + encodeURIComponent(newQuoteText);
    console.log(requestUrl);
    return fetch(requestUrl, { mode: "no-cors" });
}