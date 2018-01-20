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
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.status === 'complete') {
    const url = tab.url;
    siteCheck(url);
    console.log("before save")
    // let test = chrome.storage.local.get(null);
    // console.log(test);
  }
});

function siteCheck(url) {
  console.log(url);
  const name = extractName(url);
  console.log(name);
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://haveibeenpwned.com/api/v2/breach/${name}`, true);
  xhr.onloadend = function () {
    if (xhr.status == 404) {
      console.log('not found');
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
      const alertMessage = `${resp.Name} pwnCount: ${resp.PwnCount}.\n
      Details: ${resp.Domain} was breached on ${resp.BreachDate}, affecting
      ${resp.PwnCount} customers. The breach was made public on ${resp.AddedDate},
       exposing ${resp.DataClasses}`;
      // console.log(resp);
      chrome.storage.local.set({'respVal': alertMessage})
      console.log(alertMessage);
    }
  };
  xhr.send();
}

// const didItWork = chrome.storage.local
// console.log(didItWork);
chrome.storage.local.get(function(result){console.log(result.respVal)})
