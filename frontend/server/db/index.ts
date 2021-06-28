import * as  mongoose from 'mongoose';
import {uri} from './config';

export const connectMongooseDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("mongoDb connect...");
    } catch(err) {
        throw err.message;
    };
};