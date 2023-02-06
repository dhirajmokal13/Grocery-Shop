import Mongoose from "mongoose";
Mongoose.set('strictQuery', false);
const conn = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName: 'grocery-shop',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        await Mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("Database Connected Successfully");
    } catch (err) {
        console.log(err);
    }
};

export default conn;