import { BaseEntity } from './BaseEntity'
import * as Config from './../Config'
import * as SocketManager from '../Lib/SocketManager'
import * as mongooee from 'mongoose'

export class MessageClass extends BaseEntity {
    constructor() {
        super('Message')
    }

    async sendMessage(payload: UserRequest.ISendMessage) {
        let IO_SERVER = await SocketManager.getIoServer();
        // list of all connected socket.
        Object.keys(IO_SERVER.sockets.sockets).forEach(function (id) {
            SocketManager.emitData('new-message', [id], { message: payload.message, senderId: payload.senderId, socketId: id });

        })
        // send event to all client 
        // IO_SERVER.emit('new-message', { message: payload.messages, senderId: payload.senderId });
    }


    async newMessages(payload: UserRequest.ISendMessage) {
        let userDetails = await this.DAOManager.findOne("User", { socketId: payload.socketId }, {}, { lean: true });

        // create message for eaach user
        if (userDetails) {
            let messageData = {
                senderId: payload.senderId,
                sendTo: userDetails._id,
                messageType: Config.APP_CONSTANTS.DATABASE.MESSAGE_TYPE.TEXT,
                message: payload.message,
                isMessageRead: false,
                createdAt: Date.now()
            };
            if (payload.senderId.toString() === userDetails._id.toString()) {
                messageData.isMessageRead = true;
            }
            await this.DAOManager.saveData('Message', messageData);
        }
    }

    async getMessageList(payload: UserRequest.UreadMessage) {

        let pipline = [];

        pipline.push({
            $match: {
                $expr: {
                    $or: [
                        { $eq: ["$senderId", mongooee.Types.ObjectId(payload.userId)] },
                        { $eq: ["$sendTo", mongooee.Types.ObjectId(payload.userId)] }
                    ]
                }
            }
        });

        pipline.push({
            $project: {
                message: 1
            }
        });

        return this.DAOManager.aggregateData("Message", pipline, { lean: true });

    }

    async getUnreadMessage(payload: UserRequest.UreadMessage) {


        let pipline = [];
        let criteria = {
            sendTo: mongooee.Types.ObjectId(payload.userId),
            isMessageRead: false
        };

        let update = {
            isMessageRead: true
        };

        pipline.push({
            $match: criteria
        });

        pipline.push({
            $project: {
                message: 1
            }
        });

        let aggregateData = await this.DAOManager.aggregateData("Message", pipline, { lean: true });
        await this.DAOManager.updateMany("Message", criteria, update, { lean: true, new: true });
        return aggregateData;

    }


}