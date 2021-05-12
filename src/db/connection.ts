import mongoose from 'mongoose';
let isConnected: boolean;

export const connectToDatabase = async (): Promise<void> => {
    try {
        if (isConnected) {
            console.log('=> using existing database connection');
            return Promise.resolve();
        }

        console.log('=> using new database connection');
        const db = await mongoose.connect(process.env.MONGODB_ATLAS_URI || '', {
            useNewUrlParser: true,
        });
        isConnected = Boolean(db.connections[0].readyState);
        console.log('Connected...');

        return Promise.resolve();
    } catch (error) {
        return error.message;
    }
};
