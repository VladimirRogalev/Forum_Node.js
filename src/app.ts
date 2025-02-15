import 'reflect-metadata';
import express, {Application, NextFunction, Request, Response} from 'express';
import {NotFoundError, useExpressServer} from 'routing-controllers';
import PostController from './forum/controllers/PostController';
import dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import UserController from './account/controllers/UserController';
import {AuthMiddleware} from './account/Middleware/AuthMiddleware';
import {User} from './account/model/User';

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
    // authorizationChecker: (action, roles) => {
    //     const token = action.request.headers["authorization"];
    //     const user = await getEntityManager().findOneByToken(User, token);
    //     if (user && !roles.length) return true;
    //     if (user && roles.find(role => user.roles.indexOf(role) !== -1)) return true;
    //
    //     return false;
    // }
    middlewares: [AuthMiddleware]
});

async function startServer() {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);
