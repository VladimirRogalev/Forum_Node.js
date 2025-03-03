import 'reflect-metadata';
import express, {Application, NextFunction, Request, Response} from 'express';
import {useExpressServer} from 'routing-controllers';
import PostController from './forum/controllers/PostController';
import dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import UserController from './account/controllers/UserController';
import {AuthenticationMiddleware} from './account/Middleware/AuthenticationMiddleware';
import {AuthorizationMiddleware} from './account/Middleware/AuthorizationMiddleware';


dotenv.config();

const MONGO_URI = process.env.MONGO_URI_LOCAL;

mongoose.connect(MONGO_URI!)
    .then(() => console.log('Connected to MongoDb'))
    .catch((err) => {
        console.error('MongoDb connection error: ' + err.message);
        process.exit(1);
    });

const app: Application = express();
const PORT = 8080;


app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    res.status(400).json({error: err.message});
});


useExpressServer(app, {
    controllers: [PostController, UserController],
    middlewares: [AuthenticationMiddleware]
});

async function startServer() {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);
