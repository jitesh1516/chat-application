"use strict";
//Internal Dependencies
import * as Hsrc from "hapi";
import { Routes } from "./src/Routes";
import { Plugins } from "./src/Plugins";
import * as Config from "./src/Config";
import * as Bootstrap from "./src/Utils/BootStrap";
import * as SocketManager from './src/Lib/SocketManager';

let env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

console.log("env", env);

const server = Hsrc.server({
  port: Config.APP_CONSTANTS.SERVER.PORTS.LOCAL,
  routes: { cors: true },
});

const init = async () => {
  await server.register(Plugins);
  try {
    server.route(Routes);
    server.log("info", "Plugins Loaded");
    await server.start();
    let db = new Bootstrap.Bootstrap();
    await db.connectToDb();
     // open socket
     setTimeout(async () => {
      await SocketManager.connect(server.listener);
  }, 1000 * 5);

    console.log("Server running at:", Config.APP_CONSTANTS.SERVER.PORTS.LOCAL);
  } catch (err) {
    console.log("Error while loading plugins : " + err);
  }
};

init();
