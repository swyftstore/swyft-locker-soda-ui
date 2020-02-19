"use strict";

const Promise = require("promise"),
  Boom = require("boom"),
  Utils = require("../../utils"),
  config = Utils.loadConfig(),
  appConfig = config.app,
  serviceConfig = config.services,

  Soda = {};


Soda.findLocations = (request, h) => { 
  const headers = buildHeaders(),  
        payload = request.payload,
        path = `${serviceConfig.soda.host}${serviceConfig.soda.paths.findLocations}`;
  Utils.infoLogger("path: ",path)
  Utils.infoLogger("headers: ",headers)
  Utils.infoLogger("payload: ",payload)
  return Utils.postRequestor(path, payload, headers)
 }

Soda.createOrder = (request, h) => { 
  const headers = buildHeaders(),
        payload = request.payload,
        path = `${serviceConfig.soda.host}${serviceConfig.soda.paths.createOrder}`;
  Utils.infoLogger("path: ",path)
  Utils.infoLogger("headers: ",headers)
  Utils.infoLogger("payload: ",payload)
  return Utils.postRequestor(path, payload, headers)
}

Soda.updateOrder = (request, h) => { 
  const headers = buildHeaders(),
        orderId = request.query.order_id,
        payload = request.payload,
        path = `${serviceConfig.soda.host}${serviceConfig.soda.paths.getOrder}/${orderId}`;
  Utils.infoLogger("path: ",path)
  Utils.infoLogger("headers: ",headers)
  Utils.infoLogger("payload: ",payload)
  return Utils.putRequestor(path, payload, headers)
}

Soda.getOrder = (request, h) => { 
  const headers = buildHeaders(),
        orderId = request.query.order_id,
        path = `${serviceConfig.soda.host}${serviceConfig.soda.paths.getOrder}/${orderId}`;
  Utils.infoLogger("path: ",path)
  Utils.infoLogger("headers: ",headers)
  return Utils.getRequestor(path, headers)
}

Soda.enrollWebHook = (request, h) => { 
  const headers = buildHeaders(),
        payload = request.payload,
        path = `${serviceConfig.soda.host}${serviceConfig.soda.paths.enrollWebHook}`;
  Utils.infoLogger("path: ",path)
  Utils.infoLogger("headers: ",headers)
  Utils.infoLogger("payload: ",payload)
  return Utils.postRequestor(path, payload, headers)
}

Soda.cancelWebHook = (request, h) => { 
  const headers = buildHeaders(),
        orderId = request.query.order_id,
        path = `${serviceConfig.soda.host}${serviceConfig.soda.paths.cancelWebHook}`;
  Utils.infoLogger("path: ",path)
  Utils.infoLogger("headers: ",headers)
  return Utils.delRequestor(path, headers)
}

const buildHeaders = () => {
  const publicKey = appConfig.publicKey,
        privateKey = appConfig.privateKey,
        ts = new Date().getTime();        

  const signature = Utils.createHmacString(privateKey, ts);

  const headers = {        
    ts:`${ts}`,
    signature,
    public_key: publicKey,
    'Content-Type': 'application/json'
  };

  return headers
}

module.exports = Soda;
