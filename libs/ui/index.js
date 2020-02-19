'use strict';

const Hapi = require('hapi'),
    Joi = require('joi'),
    Soda = require('../handlers/soda'),
    Path = require("path"),
    Inert = require("inert");

exports.plugin = {
    register: async function (server, options) {       
        server.register(Inert);
        server.route({
                method: 'GET',
                path: '/home',
                handler: function (request, h) {                      
                    const path = Path.resolve(__dirname, "../../public/index.html")                
                    return h.file(path)
                }
        });

        server.route({
                 path: "/{path*}",
                 method: "GET",
                 handler: {
                     directory: {
                         path: Path.resolve(__dirname, "../../public/"),
                         listing: false,
                         index: false
                     }
        }}); 
        
    }   
}

exports.plugin.pkg = require('./package.json')
