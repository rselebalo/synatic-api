import express from 'express';
import { connectToDatabase } from './db/connection';
import basicAuth from 'express-basic-auth';
import routes from './routes';
require('dotenv').config();

const port = process.env.PORT || 4000;
const app = express();

app.use(
    basicAuth({
        users: {
            rethabile: process.env.AUTH_PASSWORD || '',
        },
        challenge: true,
    }),
);
app.use('/api', routes);

connectToDatabase().then(() => {
    app.listen(port, () => console.log(`🚀 Serverlistening on ${port}`));
});
