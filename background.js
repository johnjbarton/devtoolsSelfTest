// Google BSD license http://code.google.com/google_bsd_license.html
// Copyright 2011 Google Inc. johnjbarton@google.com

/*globals chrome window document console*/

// workaround chrome extensions do not support dynamic iframes

function inject(tab, request) {
    // Inject the content script then re-send the request.
    var details = {
      file: 'receiveTestcases.js',
      allFrames: true
    };
    chrome.tabs.executeScript(tab.id, details, function onExecuteScript(){
        console.log("devtoolsSelfTest background.js resend to "+tab.url, {request: request, tab: tab});
        window.setTimeout(function() {
          var ownExtension = undefined;
          chrome.extension.sendRequest(ownExtension, request);
        }, 1000);
    });
}


/**
 * request: {message: 'put', testcaseURL: loc}
 */

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

  if (request.message === 'put') {
    console.log("devtoolsSelfTest background.js scan tabs "+sender.tab.id, sender);
    
    chrome.windows.getAll({populate: true}, function(aryOfWindow) {
      aryOfWindow.forEach(function(win) {
        win.tabs.forEach(function(tab) {
          if (tab.url.indexOf('atopwi.html') !== -1) {
            console.log("devtoolsSelfTest background.js injection "+tab.id+' '+tab.url, tab);
            inject(tab, request);
          }
        });
      });
    });
  }

});