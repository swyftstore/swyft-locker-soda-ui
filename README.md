# Soma Sample UI/Proxy Server

## About
This project contains a node.js server and sample HTML UI. The node.js server acts as a proxy server and adds the security tokens to the request before passing them onto the Swyft SOMA API's. The sample HTML5 UI allows the following, selecting an item to place in a shopping cart, searching for available lockers and creating a reservation at the selected locker. There is also a swagger page that contains the all api definitions for the proxy server, including addtional endpoints not used by the UI.

## Requirements 
* Chrome, FireFox, MS Edge or Safari Browser
* npm 6.4.1 or higher
* node.js 8 or higher

## Deployment Steps
* Install npm and node. See steps on url below for your specific OS. 
  * <https://www.npmjs.com/get-npm>
* Navigate to projects folder via command line.
  * `cd your_path_here/swyft-locker-soda-ui`
* Download the required libraries. In the command line window enter below.
  * `npm i`
* Start the node.js server. In the command line window enter below
  * `npm run start`
  * If you get an error saying the port is already in use, you can change the desired port via the config.json file in the root of the project
* Open browser window and navigate to <http://localhost:8081/home> to view the running UI
  * If you updated the port value please enter it in place of '8081' in the browser window.
* A swagger page showing the available requests for the proxy server can be found on the url below
  * <http://localhost:8081/documentation> 
     * note: If the port was changed in the config.json file update the url before continuing.

## Additional Notes
* The sample UI is sessionless and contains no security layer between the client and server. In a production enviroment you should always secure any APIs used by frontend client. 
* The swagger page contains server end points that are not used by the UI at this time. These end points allow for addtional functionallity such as getting previous orders, updating an order, subscribing to a webhook and unsubscribing to the webhook.
* The config.json comes with the soma target environment url, a valid public and private key for the Swyft QA environemnt. Feel free to replace these values with a different environemnt url and your public and private keys.    

