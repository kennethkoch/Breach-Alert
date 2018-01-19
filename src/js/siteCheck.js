const { breach } = require('hibp');

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

// console.log(extractName('https://stackoverflow.com/questions/13564277/chrome-extension-change-address-bar-button-background-color-at-runtime'));

function findBreaches(url) {
  const name = extractName(url);
  console.log(name);
  breach(name).then((breaches) => {
    if (breaches) {
      console.log(breaches);
    } else {
      console.log('not breached');
    }
  });
}

// findBreaches('https://www.linkedin.com/example');
module.exports = findBreaches;

// breach('Adobe').then((breaches) => {
//   console.log(breaches);
// });
