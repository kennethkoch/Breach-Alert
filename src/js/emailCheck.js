const { breachedAccount } = require('hibp');
const siteCheck = require('./siteCheck')

// breachedAccount('test@gmail.com').then((res) => {
//   if (res) {
//     res.forEach(acctBreach => console.log(acctBreach.Title));
//   } else {
//     console.log('not yet');
//   }
// });
siteCheck('https://www.adobe.com/')
