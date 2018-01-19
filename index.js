// testing hibp modules
const { breach } = require('hibp');
const { pwnedPassword } = require('hibp');
const { search } = require('hibp');
const { breachedAccount } = require('hibp');

// breach('Adobe').then((breaches) => {
//   console.log(breaches.DataClasses);
// });
// pass in hash of password to test
// pwnedPassword('').then((ispwned) => {
//   if (ispwned) {
//     console.log('yes');
//   } else {
//     console.log('no');
//   }
// });

// search('test@gmail.com').then((res) => {
//   if (res) {
//     console.log(res.domain);
//   } else {
//     console.log('not yet');
//   }
// });

// breachedAccount('myemail@gmail.com').then((res) => {
//   if (res) {
//     res.forEach(acctBreach => console.log(acctBreach));
//   } else {
//     console.log('not yet');
//   }
// });
