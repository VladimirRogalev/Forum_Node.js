import {ExpressMiddlewareInterface} from 'routing-controllers';
import {User} from '../model/User';
import jwt, {JwtPayload} from 'jsonwebtoken';


export class AuthorizationMiddleware implements ExpressMiddlewareInterface {

    async use(request: any, response: any, next: (err?: any) => any): Promise<any> {
        const token = request.headers['authorization'];
        if (!token) {
            return response.status(401).send('Access denied');
        }
        const jwtToken = (token.split(' '))[1];
        try {
            const {login, roles}  = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;
                if (roles.includes('admin') || roles.includes('moderator') ) {
                next();
            } else {
                return response.status(403).send('You are not authorized.');
            }
            request.user = {login, roles};
        } catch (err) {
            response.status(403).send('Invalid token');
        }
    }
}

