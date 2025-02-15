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
            // console.log(decoded);
            const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;
            const {login} = decoded;
            const user = await User.findOne({login});
            if (!user) {
                return response.status(404).send(`User with login ${login} not found`);
            }
            const paramLogin = request.params.login;
            if (user.login === paramLogin) {
                next();
            } else if (user.roles.includes('admin')) {
                next();
            } else {
                return response.status(403).send('You are not authorized to modify this user.');
            }
            request.user = decoded;
        } catch (err) {
            response.status(403).send('Invalid token');
        }
    }
}

