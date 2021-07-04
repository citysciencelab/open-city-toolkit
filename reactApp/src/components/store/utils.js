export const parseWPSResponse = (response) => {
  return response.text().then(text => {
    const parser = new DOMParser();
    const document = parser.parseFromString(text, 'text/xml');
    if (document.getElementsByTagName("ows:Exception").length) {
      throw new Error("Error: " + document.getElementsByTagName("ows:ExceptionText")[0].textContent);
    }
    return document;
  });
};
