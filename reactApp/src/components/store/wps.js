const baseURL = "http://localhost:5000/"; // will be moved to .env in following iteration

const parseWPSResponse = (response) => {
  return response.text().then(text => {
    const parser = new DOMParser();
    const document = parser.parseFromString(text, "text/xml");
    if (document.getElementsByTagName("ows:Exception").length) {
      throw new Error("Error: " + document.getElementsByTagName("ows:ExceptionText")[0].textContent);
    }
    return document;
  });
};

export const WPS = {
  GetCapabilities: () => {
    return fetch(baseURL + `wps?service=WPS&version=1.0.0&request=GetCapabilities`)
      .then(response => parseWPSResponse(response));
  },

  DescribeProcess: (identifier) => {
    return fetch(baseURL + `wps?service=WPS&version=1.0.0&request=DescribeProcess&identifier=${identifier}`)
      .then(response => parseWPSResponse(response));
  },

  Execute: (identifier, dataInputs) => {
    return fetch(baseURL + `wps?service=WPS&version=1.0.0&request=Execute&identifier=${identifier}&dataInputs=${dataInputs}`)
      .then(response => parseWPSResponse(response));
  },

  upload: (formData) =>{
    return fetch(baseURL + "upload", {
      method: "POST",
      body: formData
    }).then(response => response.text());
  }
};
