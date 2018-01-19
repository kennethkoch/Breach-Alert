console.log('it works');
const queryInfo = {
  // active: true,
  // currentWindow: true,
};
chrome.tabs.query(queryInfo, (tabs) => {
  tabs.forEach(tab => console.log(tab))
});
