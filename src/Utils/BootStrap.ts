'use strict';

import * as mongoose from 'mongoose';
import * as Config from '../Config';
const db = mongoose.connection;

export class Bootstrap {
    connectToDb() {
        mongoose.set('debug', true)
        // mongoose.set('useCreateIndex', true)
        // mongoose.set('useFindAndModify', true)
        mongoose.connect(Config.dbConfig.URI, {})
            .then((res) => {
                console.log('Connect to Database');
            })
            .catch((err) => {
                console.log(err);
                console.log('Could not connect to Database');
            });
    };
}