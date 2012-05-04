// This code is loaded by 'options' settings in Sirius
// It loads into devtools.html as a devtools extension.

chrome.devtools.panels.create("SelfTest", '', 'panel.html', function(PanelAPI) {
  console.log('DevToolsTestController.html PANEL callback', arguments);
  PanelAPI.onShown.addListener(function(win) {
    console.log('DevToolsTestController.html panel.onShown callback', arguments);
  });
});