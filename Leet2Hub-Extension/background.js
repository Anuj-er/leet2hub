chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchProxy") {
    (async () => {
      try {
        const response = await fetch(request.url, request.options);
        const headers = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });

        let body;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          body = await response.json();
        } else {
          body = await response.text();
        }

        sendResponse({
          ok: response.ok,
          status: response.status,
          headers: headers,
          body: body
        });
      } catch (error) {
        sendResponse({ error: error.message });
      }
    })();
    return true; // Keep the message channel open for async response
  }
});
