// this takes a url and turns it into a name that can be used
// as a param for the api call
function extractName(url) {
  const domain = url
    .replace('http://', '')
    .replace('https://', '')
    .split(/[/?#]/)[0];
  if (domain.split('.').length > 2) {
    return domain.split('.')[domain.split('.').length - 1];
  }
  return domain.split('.')[0];
}

// this will update popup.js when the user switches to a different tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  siteCheck();
});

//this updates popup.js when the user enters a new url
chrome.tabs.onUpdated.addListener((tab, changeInfo) => {
  siteCheck();
});

const queryInfo = {
  active: true,
};
function siteCheck() {
  chrome.tabs.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    const name = extractName(url);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://haveibeenpwned.com/api/v2/breach/${name}`, true);
    xhr.onloadend = function () {
      if (xhr.status == 404) {
        chrome.storage.local.set({ breachWarning: null });
        chrome.browserAction.setIcon({ path: { 19: 'images/noBreach.png' } });
        chrome.browserAction.setTitle({
          title: 'No breaches found.',
        });
      }
    };
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        const resp = JSON.parse(xhr.responseText);
        const pwnCount = resp.PwnCount.toLocaleString();
        const breachWarning = {
          name: resp.Name,
          pwnCount,
          description: resp.Description,
        };
        chrome.storage.local.set({ breachWarning });
        chrome.browserAction.setTitle({
          title: 'BREACH ALERT! This site has been breached, click for details',
        });
        chrome.browserAction.setIcon({ path: { 19: 'images/breach.png' } });
      }
    };
    xhr.send();
  });
}
