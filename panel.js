/*globals console window chrome */

var devtoolsURL = 'http://localhost:9222';

function createFakeController() {
    // this code runs in the devtools being debugged
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

function createInspectorExtensionRegistry(extensions) {
    if (!window.InspectorExtensionRegistry) {
        var InspectorExtensionRegistryStub = function(){};

        InspectorExtensionRegistryStub.prototype = {
            getExtensionsAsync: function(){
                console.log("Try extensions: ", extensions);
                window.WebInspector.addExtensions(extensions);
            }
        };

        window.InspectorExtensionRegistry = new InspectorExtensionRegistryStub();
        console.log("InspectorExtensionRegistry ", window.InspectorExtensionRegistry);
    }
}

function getExtensions(then) {
  chrome.devtools.inspectedWindow.eval('window.WebInspector ? window.WebInspector.getExtensions() : "NO"', then);
}

function isDevTools(url) {
  return (url.split(':')[0] === 'chrome-devtools')
}

function runTestWithFakeController(event) {
  var testURL = event.target.nextElementSibling.innerHTML;
  
  // TODO inject the test as a same domain iframe with fakeController
  
  if (isDevTools(testURL)) {
    // We are in the copy of devtools debugging the tester
    getExtensions(function(extensions, isException) {
      if (isException) {
        console.error("getExtensions FAILED", extensions);
      }
      var jsonExtensions = JSON.stringify(extensions);
      console.log('got extensions', jsonExtensions);
      var extReg = createInspectorExtensionRegistry.toString() + '\ncreateInspectorExtensionRegistry(' + jsonExtensions + ');\n';
      chrome.devtools.inspectedWindow.reload({injectedScript: extReg});
    });
  } else {
     // We are in the copy of devtools being tested.
     
    chrome.devtools.inspectedWindow.reload();
  } 
}

function getWindowURL(then) {
  chrome.devtools.inspectedWindow.eval('window.location.toString()', then);
}

function getChromeSourceRootURL(then) {
  chrome.devtools.inspectedWindow.eval('document.querySelector(\'iframe\').src', function(url) {
    var segments = url.split('/').slice(0,3);
    then(segments.join('/'));
  });
}

function updateUI() {
  getChromeSourceRootURL(function(baseURL) {
    var layoutTestURL = baseURL + '/third_party/WebKit/LayoutTests/inspector/';
    var testListContainer = window.document.querySelector('.testListContainer');
    testListContainer.innerHTML = '<iframe src=\"' + layoutTestURL + '\"></iframe>';
  });
  var testButton = window.document.querySelector('.testButton');
  testButton.addEventListener('click', runTestWithFakeController);
}

window.addEventListener('load', updateUI);