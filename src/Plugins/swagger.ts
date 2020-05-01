'use strict';

import * as HapiSwagger from 'hapi-swagger';
import * as Inert from 'inert';
import * as Vision from 'vision';

//Register Swagger Plugin
export let plugin = {
    name: "swagger-plugin",
    register: async function (server) {
        const swaggerOptions = {
            info: {
                title: 'SIMPLE CHAT API 1.0',
                version: 'v1',
            }
        };

        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: swaggerOptions
            }
        ])
    }
};


