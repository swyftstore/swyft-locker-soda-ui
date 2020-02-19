'use strict';
const Boom = require("boom"),
	Promise = require("promise"),
	Crypto = require("crypto"),
	FS = require('fs'),
	Path = require("path"),
	Fetch = require("node-fetch"),
	Logger = console.log,
	ErrorLogger = console.error,
	Utils = {};



Utils.getRequestor = (path, headers, timeout) => {
	return new Promise((resolve, reject) => {
		let _headers = {}
		if (headers) {
			_headers = headers;
		}
		return Fetch(path, {
			method: "GET",
			timeout: timeout ? timeout : 60000,
			headers: _headers,
			redirect: "follow"
		}).then(response => handleResponse(response))
		.then((body) => resolve(body))
		.catch((err) => {
			Utils.errorLogger(err)
			return reject(err)
		})
	})

}

Utils.deleteRequestor = (path, headers, timeout) => {
	return new Promise((resolve, reject) => {
		let _headers = {}
		if (headers) {
			_headers = headers;
		}
		return Fetch(path, {
			method: "DEL",
			timeout: timeout ? timeout : 60000,
			headers: _headers,
			redirect: "follow"
		}).then(response => handleResponse(response))
		.then((body) => resolve(body))
		.catch((err) => {
			Utils.errorLogger(err)
			return reject(err)
		})
	})

}

Utils.postRequestor = (path, payload, headers, timeout) => {
	return new Promise((resolve, reject) => {
		let _headers = {}
		if (headers) {
			_headers = headers;
		}
		return Fetch(path, {
			method: "POST",
			headers: _headers,
			timeout: timeout ? timeout : 60000,
			redirect: "follow",
			body: JSON.stringify(payload),
        })
        .then(response => handleResponse(response))
        .then((body) => resolve(body))
        .catch((err) => {
            Utils.errorLogger("fetch error:", err)
            return reject(err)
        })
	})
}

Utils.putRequestor = (path, payload, headers, timeout) => {
	return new Promise((resolve, reject) => {
		let _headers = {}
		if (headers) {
			_headers = headers;
		}
		return Fetch(path, {
			method: "PUT",
			headers: _headers,
			timeout: timeout ? timeout : 60000,
			redirect: "follow",
			body: JSON.stringify(payload),
        })
        .then(response => handleResponse(response))
        .then((body) => resolve(body))
        .catch((err) => {
            Utils.errorLogger("fetch error:", err)
            return reject(err)
        })
	})
}

Utils.createHmacString = (privateKey, ts) => {	
	let hmac = Crypto.createHmac('sha256', privateKey);
	hmac.update(`${ts}`);
	return hmac.digest('hex');
}

Utils.loadConfig = () => {
	const rawConfig = FS.readFileSync(Path.resolve(__dirname, "../../config.json")),
	config = JSON.parse(rawConfig)
	return config
}

Utils.errorLogger = (...e) => {
    const message = Array.from(e);
	
	const ts = new Date().toISOString();
	message.unshift(`${ts}:`);
	ErrorLogger.apply(this, message);
}

Utils.infoLogger = (...msg) => {
	const message = Array.from(msg);
	
	const ts = new Date().toISOString();
	message.unshift(`${ts}:`);
	Logger.apply(this, message);
}


const handleResponse = (response) => {
	return response.text()
	    .then((text)=>{			
			  try {
					return JSON.parse(text)
				} catch(e) {
					console.error(e)
					return text
				}
		  })
			.catch((e)=>{			  
			  throw e	
		})
}



module.exports = Utils;