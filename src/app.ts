import 'reflect-metadata';
import express, {Application, NextFunction, Response, Request} from 'express';
import {useExpressServer} from 'routing-controllers';
import PostController from './forum/controllers/PostController';
import dotenv from "dotenv";
import * as mongoose from 'mongoose';

dotenv.config();

mongoose.connect(process.env.MONGO_URI_LOCAL!)
    .then(()=> console.log("Connected to MongoDb"))
        .catch((err)=>{
            console.error("MongoDb connection error: " + err.message)
            process.exit(1)

        })

const app: Application = express();
const PORT = 8080;
// const HOST = 'http://localhost:'

app.use(express.json());

app.use((err:Error, req: Request, res: Response, next: NextFunction)=> {
    console.log(err.message);
    res.status(400).json({error: err.message});
})

useExpressServer(app, {
    controllers:[PostController],
})

async function startServer() {
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);
