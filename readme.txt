A devtools extension for running devtools layout tests.

This extension will only work in very limited circumstances. Experts only ;-).

The basic idea is to run a copy of devtools from the internal Chrome testing 
server on eg localhost:8081. Then run this extension on another copy of
devtools. The second or outer copy will have a new panel SelfTest. From there
you can select a WebKit LayoutTest .html file and hit Test. The .html file
will be loaded in to the first or inner devtools as a same-domain iframe with
a bit of code to simulate layoutTestController. The test should run and be 
debuggable from the outer devtools.

Lots of steps, so be patient.

1. Download Chrome source tree. 

2. Install the test HTTP server:
http://www.chromium.org/developers/testing/webkit-layout-tests#TOC-Tests-that-use-a-HTTP-Server

3. Run the server with rootURL point to the chrome source eg
  ./new-run-webkit-httpd --server start --port=8081 --root=/work/chrome/src/

4. Install this extension
4a. git clone git@github.com:johnjbarton/devtoolsSelfTest.git
4b. chrome://extensions, developer mode, unpacked extension ...

5. Install the Sirius extension
5a. git clone https://github.com/johnjbarton/sirius
5b. chrome://extensions, developer mode, unpacked extension ...

6. Open atopwi chrome-extension://fkhgelnmojgnpahkeemhnbjndeeocehc/atopwi/atopwi.html

7. Select localhost testing frontend and one of the backend over web socket pages.

Your inner or tester copy should come up. 

8. Right click and InspectElement or F12

Your outer or debugger copy should come up.

See also

Emulate layoutTestController in a DevTools extension
http://trac.webkit.org/wiki/Writing%20Layout%20Tests%20for%20DumpRenderTree



