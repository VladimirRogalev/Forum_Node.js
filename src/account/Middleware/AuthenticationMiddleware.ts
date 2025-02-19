import {ExpressMiddlewareInterface} from 'routing-controllers';
import {NextFunction, Request, Response} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';

export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
    async use(request: Request, response: Response, next: NextFunction): Promise<any> {
        const token = request.headers['authorization'];
        if (!token) {
            return response.status(401).json({message: 'Access denied '});
        }
// Bearer ${jwt}
        const parts = token.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return response.status(401).json({message: 'Invalid token format'});
        }
        const jwtToken = parts[1];
        if (!process.env.JWT_SECRET) {
            return response.status(500).json({message: 'JWT secret is not configured'});
        }
        try {
            const decode = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;
            request.body = {...request.body, ...decode};
            return  next();

        } catch (err) {
            return  response.status(403).json({message: 'Invalid token 1'});
        }
    }
}