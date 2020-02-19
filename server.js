'use strict';

const Hapi = require('hapi'),
      Glue = require('glue'),
      Inert = require('inert'),
      Vision = require('vision'),
      Swagger = require('hapi-swagger'),               
      Utils = require("./libs/utils"),
      config = Utils.loadConfig(),
      manifest = config.glueManifest;

if (config.swagger) {   
    manifest.register.plugins.push({plugin: Vision})
    manifest.register.plugins.push({plugin: Swagger, options: config.swagger})
}

manifest.register.plugins.push({plugin: Inert})

var options = {
    relativeTo: __dirname + '/libs'
};

const startServer = async function () {
    try {
      
        const server = await Glue.compose(manifest, options);
        await server.start();

        Utils.infoLogger("Soda Proxy Server Up");
        process.on('unhandledRejection', (reason, promise) => {
          Utils.infoLogger('Unhandled Rejection at:', promise);
          Utils.infoLogger('::::::: Reason ::::::::', reason);
          Utils.infoLogger(':::::STACK:::::::', reason.stack);

          // Application specific logging, throwing an error, or other logic here
        });


    }
    catch (err) {
        Utils.errorLogger(err);
        process.exit(1);
    }
};
startServer();