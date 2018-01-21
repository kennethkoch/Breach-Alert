console.log('it works');

const account = encodeURIComponent('joe@gmail.com');

const queryInfo = {
  active: true,
  // currentWindow: true,
};

function extractName(url) {
  const domain = url
    .replace('http://', '')
    .replace('https://', '')
    .split(/[/?#]/)[0];
  if (domain.split('.')[0] === 'www') {
    return domain.split('.')[1];
  }
  return domain.split('.')[0];
}
// let tabUpdated = false;
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//         }
//     }
// });
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log(activeInfo);
  siteCheck();
  console.log('before save');
  // let test = chrome.storage.local.get(null);
  // console.log(test);
});

function siteCheck() {
  chrome.tabs.query(queryInfo, (tabs) => {
    const tab = tabs[0];
    const url = tab.url;
    const name = extractName(url);
    console.log(name);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://haveibeenpwned.com/api/v2/breach/${name}`, true);
  xhr.onloadend = function () {
    if (xhr.status == 404) {
      console.log('not found');
      chrome.storage.local.set({ breachWarning: null });
    }
  };
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      // JSON.parse does not evaluate the attacker's scripts so im safe
      // from XSS, use https only to stop possible MITM attacks
      // TO-DO find out how to handle 404 when acct is not found in db
      const resp = JSON.parse(xhr.responseText);
      // const description = resp.Description.replace(/ <a*>/, '')
      // console.log(description);
      const breachWarning = {
        name: resp.Name,
        pwnCount: resp.PwnCount,
        breachDate: resp.BreachDate,
        added: resp.AddedDate,
        domain: resp.Domain,
        description: resp.Description,
      };
      // console.log(resp);
      chrome.storage.local.set({ breachWarning });
      console.log(breachWarning);
    }
  };
  xhr.send();
})
}

// const didItWork = chrome.storage.local
// console.log(didItWork);
chrome.storage.local.get((result) => {
  console.log(result.breachWarning);
});

siteCheck();
