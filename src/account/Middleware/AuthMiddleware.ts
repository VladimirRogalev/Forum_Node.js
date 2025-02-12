import {Action, ExpressMiddlewareInterface, ForbiddenError, Middleware, NotFoundError} from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import {decodeBase64, encodeBase64} from '../utils/utilsForPassword';
import {User} from '../model/User';

export class AuthMiddleware implements ExpressMiddlewareInterface {
    async use(request: Request, response: Response, next: NextFunction): Promise<void> {
        const token = request.headers["authorization"];
        if (!token) {
            response.status(401).send("Access denied")
            return;
        }
        let [login, password] = decodeBase64((token.split(" "))[1]).split(":");
        if (!login || !password) {
            response.status(401).send('Username or password is missing');
            return;
        }
        const user = await User.findOne({login: login});
        if (user === null) {
            response.status(401).send(`User with login ${login} not found`);
            return;
        }
        const pass = user.password;
        const encodePass = encodeBase64(password);
        if (pass !== encodePass) {
            response.status(401).send("Invalid password");
            return ;
        }

        next();
    }

}