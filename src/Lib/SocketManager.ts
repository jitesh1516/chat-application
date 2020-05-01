'use strict';

import * as Server from 'socket.io';
import * as mongoose from 'mongoose';

import * as Config from './../Config'
import { socket } from 'src/Config/appConstants';
import { DAOManager } from '../DAOManager'


const DAOManagerObj = new DAOManager();

let IO_SERVER;

/**
 * @description Start Socket IO Server
 * @param httpServer
 */
export const connect = async (httpServer) => {
    IO_SERVER = Server(httpServer)
    IO_SERVER.on('connection', socket => {
        console.log("client connected with socketId => ", socket.id);
        socket.emit('NEW-CONNECTION', { socketId: socket.id });
    });

};

export const getIoServer = async () => {
    if (IO_SERVER) {
        return IO_SERVER;
    }
}


export const client = async () => {
    let socketId;
    return new Promise(async function (resolve, reject) {
        const io = require("socket.io-client"),
            client = io.connect("http://localhost:3003");
        client.on('data', function (chunk) {
            console.log(`Data received from the server: ${chunk.toString()}.`);
            // Request an end to the connection after the data has been received.
            client.end();
        });
        client.on('NEW-CONNECTION', data => {
            socketId = data.socketId;
            return resolve(socketId);
        })

        client.on('new-message', data => {
            // we are importing here because of cyclic issues.
            const MessageClass = require('../Entity/Message').MessageClass;
            const messageClass = new MessageClass();
            messageClass.newMessages(data);
        });

        client.on('end', function () {
            console.log('Requested an end to the TCP connection');
        });
    });
}


/**
 * @description emits data to provided socket ids 
 * @param event 
 * @param socketIds 
 * @param data 
 */
export const emitData = (event: string, socketIds: string[], data: any) => {
    if (socketIds && socketIds.length === 0)
        return Promise.reject('One or more socketIds required');
    else if (IO_SERVER) {
        IO_SERVER.to(socketIds).emit(event, data);
    } else {
        return Promise.reject('Socket IO server not running');
    }
};

export const broadcastData = (event: string, data: any) => {
    if (IO_SERVER) {
        IO_SERVER.emit(event, data);
    }
}

