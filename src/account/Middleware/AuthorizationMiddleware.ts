import {ExpressMiddlewareInterface} from 'routing-controllers';

import jwt, {JwtPayload} from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';


export class AuthorizationMiddleware implements ExpressMiddlewareInterface {

    async use(request: Request, response: Response, next: NextFunction): Promise<any>{

        try {
            const { login, roles } = request.body
                if (!login || !roles) {
                return response.status(403).json({ message: 'Invalid token or missing user data' });
            }
            const requestedLogin = request.params.login || request.body.login;
                if (requestedLogin === login|| roles.includes('admin') || roles.includes('moderator') ) {
                    return next();
            } else {
                return response.status(403).send('You are not authorized.');
            }
        } catch (error) {
            return response.status(500).json({message: "Server error"});
        }
    }
}

