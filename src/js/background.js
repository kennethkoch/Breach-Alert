console.log('it works');

const account = encodeURIComponent('joe@gmail.com');

const queryInfo = {
  active: true,
  // currentWindow: true,
};

// TODO clean this up
// this takes a url and turns it into a name that can be used
// as a param for the api call
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

function formatDate(date) {
  let newDate = new Date(date);
  newDate = newDate.toLocaleString();
  return newDate.split(',')[0];
}

function formatDataClasses(dataClasses) {
  console.log(dataClasses);
  const last = dataClasses[dataClasses.length - 1];
  const rest = dataClasses.splice(0, dataClasses.length - 1);
  let result = `${rest.join(', ')} and ${last}`;
  result = result.substr(0, 1) + result.substr(1).toLowerCase();
  return result;
}

// this will update popup.js when the user switches to a different tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log(activeInfo);
  siteCheck();
  console.log('before save');
  // let test = chrome.storage.local.get(null);
  // console.log(test);
});

// TO-DO update popup.js when a new url is entered
chrome.tabs.onUpdated.addListener((tab, changeInfo) => {
  siteCheck();
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
        chrome.browserAction.setIcon({ path: { 19: 'images/noBreach.png' } });
        chrome.browserAction.setTitle({
          title:
            'No breaches found.',
        });
      }
    };
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        const resp = JSON.parse(xhr.responseText);
        const publicDate = formatDate(resp.AddedDate);
        const breachDate = formatDate(resp.BreachDate);
        const dataTypes = formatDataClasses(resp.DataClasses);
        const pwnCount = resp.PwnCount.toLocaleString();
        const breachWarning = {
          name: resp.Name,
          pwnCount,
          breachDate,
          publicDate,
          domain: resp.Domain,
          dataTypes,
          description: resp.Description,
        };
        console.log(`pwncount:::::::${breachWarning.description}`);
        chrome.storage.local.set({ breachWarning });
        chrome.browserAction.setTitle({
          title: 'PWN ALERT! This site has been breached, click for details',
        });
        chrome.browserAction.setIcon({ path: { 19: 'images/breach.png' } });
        console.log(breachWarning);
      }
    };
    xhr.send();
  });
}

chrome.storage.local.get((result) => {
  console.log(result.breachWarning);
});

siteCheck();
