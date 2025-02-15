import {ExpressMiddlewareInterface} from 'routing-controllers';

import jwt, {JwtPayload} from 'jsonwebtoken';

export class AuthenticationMiddleware implements ExpressMiddlewareInterface {
    async use(request: any, response: any, next: (err?: any) => any): Promise<any> {
        const token = request.headers['authorization'];
        if (!token) {
            return response.status(401).send('Access denied');
        }
// Bearer ${jwt}
        const jwtToken = (token.split(' '))[1];
        try {
            // const {login, roles} = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;
            // const user = await User.findOne({login});
            // if (!user) {
            //     response.status(403).send('Invalid token');
            // }

            // console.log(decoded);
            request.user =jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;
            next();
        } catch (err) {
            response.status(403).send('Invalid token');
        }
    }
}

// export function checkCredentials

// export const checkCredentials = (login: string, password: string) => {
//     User.findOne({login, password: encodeBase64(password)}).then(Boolean);
// };