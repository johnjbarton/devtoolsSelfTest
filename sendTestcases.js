// content script, sends all .html URLs to devtools testing

var loc = window.location.toString();
if (loc.indexOf('.html') !== -1) {
  var ownExtension = undefined;
  chrome.extension.sendRequest(ownExtension, {message: 'put', testcaseURL: loc});
}
