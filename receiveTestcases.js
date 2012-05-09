// Google BSD license http://code.google.com/google_bsd_license.html
// Copyright 2011 Google Inc. johnjbarton@google.com

/*globals chrome window document console*/


// Content script loaded in to atopwi.html all_frames

function isDevtools() {
  return document.querySelector('#-webkit-web-inspector');
}

console.log("receiveTestcases isDevtools "+isDevtools() + ' in ' + window.location.toString());

if (isDevtools()) {

  function injectLayoutTestController() {
    function createFakeController() {
      var layoutTestController = {
        dumpAsText: function() {
          console.log("dumpAsText");
        },
        waitUntilDone: function() {
          console.log("waitUntilDone");
        },
        evaluateInWebInspector: function(runTestCallId, toEvaluate) {
          chrome.devtools.protocol.Page.navigate(devtoolsURL, function() {
            chrome.devtools.protocol.Page.reload(false, toEvaluate);
          });
        }
      };
      console.log("layoutTestController " + layoutTestController);
      window.layoutTestController = layoutTestController;
    }
    var scriptElt = document.createElement('script');
    scriptElt.textContent =  createFakeController.toString() + '\ncreateFakeController();';
    document.head.appendChild(scriptElt);
  }

  function listenForTestCases() {
    chrome.extension.onRequest.addListener(function loadTestCase(request) {
      console.log('loadTestCase ', request);
      if (!window.devtoolsSelfTestFrame) {
        var frame = window.devtoolsSelfTestFrame = document.createElement('iframe');
        frame.addEventListener('DOMContentLoaded', function wireAcrossFrames() {
          frame.contentWindow.LayoutTestController = window.LayoutTestController;
        });
        window.body.appendChild(frame);
      }
      window.devtoolsSelfTestFrame.setAttribute('src', request.testcaseURL);
    });

    chrome.extension.sendRequest(undefined, {message: 'none'}, function(response) {
      if (chrome.extension.lastError) {
        console.error("listenForTestCases error", chrome.extension.lastError);
      }
      console.log("listenForTestCases response", response);
    });
    console.log('listenForTestCases sent and listening in '+window.location);
  }

  injectLayoutTestController();
  listenForTestCases();
  
} 
