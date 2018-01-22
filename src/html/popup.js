chrome.storage.local.get({ breachWarning: 'defaultValue' }, (items) => {
  console.log(items.breachWarning);
  if (items.breachWarning) {
    document.getElementById('breached').textContent = `${
      items.breachWarning.name
    } has been breached`;
    document.getElementById('pwnCount').innerText = `Pwn Count: ${items.breachWarning.pwnCount}`;
    document.getElementById('description').innerHTML += `<p>${items.breachWarning.description}</p>`;
  } else {
    document.getElementById('safe').innerText = 'No breaches involving this site were found.';
    document.getElementById('noBreachMessage').innerHTML = '<p>This does not mean this site has never been breached, only that no information regarding a breach of this site has been made public at this time. You should still be sure to <span id=\'never\'>never</span> use the same password for multiple services.</p>';
  }
});
