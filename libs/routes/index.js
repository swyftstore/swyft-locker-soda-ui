'use strict';

const Hapi = require('hapi'),
    Joi = require('joi'),
    Soda = require('../handlers/soda'),
    Inert = require("Inert");

exports.plugin = {
    register: async function (server, options) {
        const DefaultMaxDistance = "10000",
              NotificationTypes = ["email/push", "sms", "none"];   
         
        server.route({
            method: 'GET',
            path: '/get_order',
            handler: Soda.getOrder,
            options: {
                pre: [],
                tags: ['api'],
                description: "This request returns exisiting order details for the passed in Order Id",
                validate: {
                    query: {
                        order_id: Joi.string().required().description("The order id being requested"),
                    },
                    headers: Joi.object({ })
                    .options({
                        allowUnknown: true
                    })
                }    
            }
        });

        //find available locations
        server.route({
            method: 'Post',
            path: '/find_locations',
            handler: Soda.findLocations,
            options: {
                pre: [],
                tags: ['api'],
                description: "This request will return a list of available locations",
                validate: {
                    payload: {
                        max_distance: Joi.number().default(DefaultMaxDistance),
                        is_ada: Joi.boolean().default(false),
                        address: Joi.object().keys({
                            address1: Joi.string().optional(),
                            address2: Joi.string().optional(),
                            city: Joi.string(),
                            state: Joi.string(),
                            zip: Joi.string(),
                            country: Joi.string(),
                            coordinates: Joi.object().keys({
                                lat: Joi.number().required(),
                                lon: Joi.number().required()
                            })
                        }).or('city', 'state', 'zip', 'coordinates'),
                        order_dimensions: Joi.object().keys({
                            h: Joi.number().required(),
                            l: Joi.number().required(),
                            w: Joi.number().required()
                        }).required(),
                        arrival_date: Joi.date().iso().optional()
                    },
                    headers: Joi.object({}).options({
                        allowUnknown: true
                    })
                }
            }
        });

        server.route({
            method: 'Post',
            path: '/create_order',
            handler: Soda.createOrder,
            options: {
                pre: [],
                tags: ['api'],
                description: "This requests allows the creation of new orders",
                validate: {
                    payload: {
                        location_id: Joi.string().required(),
                        notification_type: Joi.array().unique().items(Joi.string().lowercase().valid(NotificationTypes)).min(1).max(3).optional(),
                        is_ada: Joi.boolean().default(false),
                        order: Joi.object().keys({
                            id: Joi.string().required(),
                            tracking_number: Joi.string().optional(),
                            carrier: Joi.string().optional(),
                            arrival_date: Joi.date().iso().optional(),
                            status: Joi.string().required(),
                            ageVerificationNeeded: Joi.boolean().default(false),
                            dimensions: Joi.object().keys({
                                h: Joi.number().required(),
                                l: Joi.number().required(),
                                w: Joi.number().required()
                            }).required(),
                        meta_data: Joi.object().optional()
                        }).required(),
                        customer: Joi.object().keys({
                            first_name: Joi.string().required(),
                            last_name: Joi.string().required(),
                            email_address: Joi.string().email().required(),
                            phone_number: Joi.string(),
                            meta_data: Joi.object().optional()
                        }).required()
                    },
                    headers: Joi.object({}).options({
                        allowUnknown: true
                    })
                }
            }
        });

        server.route({
            method: 'Put',
            path: '/update_order',
            handler: Soda.updateOrder,
            options: {
                pre: [],
                tags: ['api'],
                description: "This request updates an exising order",
                validate: {
                    query: {
                        order_id: Joi.string().required().description("The order id being requested"),
                    },
                    payload: Joi.object().keys({
                        location_id: Joi.string(),
                        notification_type: Joi.array().unique().items(Joi.string().lowercase().valid(NotificationTypes)).min(1).max(3).optional(),
                        is_ada: Joi.boolean().only([true, false]),
                        ageVerificationNeeded: Joi.boolean().default(false),
                        order: Joi.object().keys({
                            tracking_number: Joi.string().optional(),
                            carrier: Joi.string().optional(),
                            dimensions: Joi.object().keys({
                                h: Joi.number().optional(),
                                w: Joi.number().optional(),
                                l: Joi.number().optional()
                            }).optional(),
                            arrival_date: Joi.date().iso().optional(),
                            status: Joi.string().optional(),
                            meta_data: Joi.object().optional()
                        }),
                        customer: Joi.object().keys({
                            first_name: Joi.string().required(),
                            last_name: Joi.string().required(),
                            email_address: Joi.string().email().required(),
                            zip_code: Joi.string().optional(),
                            phone_number: Joi.string().optional(),
                            meta_data: Joi.object().optional()
                        })
                    }).or("location_id", "send_notification", "is_ada", "order", "customer")
                }
            }
        });

        server.route({
            method: 'Post',
            path: '/enroll_web_hook',
            handler: Soda.enrollWebHook,
            options: {
                pre: [],
                tags: ['api'],
                description: "This request allows the enrollment in a webhook that returns order status updates",
                validate: {
                    payload: {
                        org_id: Joi.string(),
                        target_url: Joi.string().uri({ scheme: ['https'] }).required()
                    }
                }
            }
        });

        server.route({
            method: 'Del',
            path: '/cancel_web_hook',
            handler: Soda.cancelWebHook,
            options: {
                pre: [],
                tags: ['api'],
                description: "This request allows the unEnrollment in the webhook",
                validate: {              
                    headers: Joi.object({
                        "analytics": Joi.object().optional(),
                        // "session_id": Joi.string().required()
                    }).options({
                        allowUnknown: true
                    })
                }                   
            }
        });
    }
       
}

exports.plugin.pkg = require('./package.json')
