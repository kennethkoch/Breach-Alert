console.log('it works');

const account = encodeURIComponent('joe@gmail.com');

const xhr = new XMLHttpRequest();
xhr.open('GET', `https://haveibeenpwned.com/api/v2/breachedaccount/${account}`, true);
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4) {
    // JSON.parse does not evaluate the attacker's scripts so im safe
    //from XSS, use https only to stop possible MITM attacks
    //TO-DO find out how to handle 404 when acct is not found in db
    const resp = JSON.parse(xhr.responseText)
    console.log(resp);
  }
};
xhr.send();

const queryInfo = {
  // active: true,
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

chrome.tabs.query(queryInfo, (tabs) => {
  const tab = tabs[1];
  console.log(tabs);
  const url = tab.url;
  console.log(url);
  const name = extractName(tab.url);
  console.log(name);
});
