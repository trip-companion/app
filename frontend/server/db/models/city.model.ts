import * as mongoose from 'mongoose';
// const ObjectId = mongoose.Schema.Types.ObjectId;
interface ICity extends mongoose.Document{
    _id?: string;
    recordid: string;
    fields: {
        cityNames: {
            en: string;
            ru: string;
            ua: string;
        },
        country: string;
        region: string;
        longitude: number;
        latitude: number;
        accentcity: string;
    };
};

const CitySchema = new mongoose.Schema({
    recordid: {
        type: String,
        required: true
    },
    fields: {
        cityNames: {
            en: {
                type: String,
                required: true
            },
            ru: {
                type: String,
                required: true
            },
            ua: {
                type: String,
                required: true
            },
        },
        country: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        accentcity: {
            type: String,
            required: true
        },
    }},{
        versionKey: false // You should be aware of the outcome after set to false
});

const CityModel = mongoose.model<ICity>('cities', CitySchema);
export { CityModel, ICity };