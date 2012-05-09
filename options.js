/*globals console window document chrome */

var devtoolsURL = 'http://localhost:9222';


function createTestFrame(testURL) {
   // this code runs in the devtools being debugged
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
 
  var iframe = document.createElement('iframe');
  iframe.setAttribute('src', testURL);
  iframe.addEventListener('DOMContentLoaded', function() {
      createFakeController();
  });
  document.body.appendChild(iframe);
}

function runTestWithFakeController(url) {
  console.log("RUN "+url);
}

function URLInput(id, buttonText) {
  this.div = document.createElement('div');
  this.div.classList.add(id);

  var button = document.createElement('button');
  button.innerHTML = buttonText;
  button.addEventListener('click', this.clickListener);
  this.div.appendChild(button);
  
  var form = document.createElement('form');
  this.div.appendChild(form);
    
  var input = document.createElement('input');
  input.setAttribute('class', id + '_input');
  input.setAttribute('size', '128');
  input.addEventListener('keydown', function(event) {
    if (event.which === 13) {
      this.clickListener(event);
      event.preventDefault();
    }
  }.bind(this));
  form.appendChild(input);
  
}

URLInput.prototype = {
    clickListener: function(event) {
        var value = event.currentTarget.parentElement.querySelector('input').value;
        this.listener(value);
    },
    getValue: function() {
        return this.div.querySelector('input').value;
    },
    addListener: function(fncOfValue) {
      this.listener = fncOfValue;
    }
};

function updateUI() {
  var testController = document.querySelector('.testController');

  var testURLDiv = new URLInput('testServer', 'Set Test Server');
  testURLDiv.addListener(function(baseURL) {
    var layoutTestURL = baseURL + '/third_party/WebKit/LayoutTests/inspector/';
    var testListContainer = window.document.querySelector('.testListContainer');
    testListContainer.innerHTML = '<iframe src=\"' + layoutTestURL + '\"></iframe>';
  });
  testController.appendChild(testURLDiv.div);
  
  var testButton = new URLInput('testcase', 'Run Test');
  testButton.addListener(function(value) {
    runTestWithFakeController(value);
  });
  testController.appendChild(testButton.div);
}

window.addEventListener('load', updateUI);