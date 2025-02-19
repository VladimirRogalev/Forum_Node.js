import UserService from './UserService';
import NewUserDto from '../dto/NewUserDto';
import UserDto from '../dto/UserDto';
import {User} from '../model/User';
import {ForbiddenError, NotFoundError} from 'routing-controllers';
import {decodeBase64, encodeBase64} from '../utils/utilsForPassword';
import jwt from 'jsonwebtoken';


export default class UserServiceImpl implements UserService {

    async register(newUserDto: NewUserDto): Promise<UserDto> {
        let encodePass = encodeBase64(newUserDto.password);
        const existingUser = await User.findOne({ login: newUserDto.login });
        if (existingUser) {
            throw new ForbiddenError(`User with login ${newUserDto.login} already exists`);
        }
        const newUser = new User({
            ...newUserDto,
            password: encodePass
        });

        const res = await newUser.save();
        return new UserDto(res.login, res.firstName, res.lastName, res.roles);
    }

    async removeUserByLogin(login: string): Promise<UserDto> {

        const user = await User.findOne({login: login});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        await user.deleteOne();
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async getUserByLogin(login: string): Promise<UserDto> {
        const user = await User.findOne({login: login});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async getAllUser(): Promise<UserDto[]> {
        const users = await User.find();
        if (users.length === 0) {
            throw new NotFoundError('Users not found');
        }
        return users.map(user => {
            return new UserDto(user.login, user.firstName, user.lastName, user.roles);
        });
    }

    async updateUser(login: string, firstName: string, lastName: string): Promise<UserDto> {
        const user = await User.findOneAndUpdate({login: login}, {
            $set: {
                firstName: firstName, lastName: lastName
            }
        }, {new: true});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async addUserRole(login: string, role: string): Promise<UserDto> {
        const user = await User.findOneAndUpdate({login: login}, {$push: {roles: role}}, {new: true});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async removeRole(login: string, role: string): Promise<UserDto> {
        const user = await User.findOneAndUpdate({login: login}, {$pull: {roles: role}}, {new: true});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async login(login: string, password: string): Promise<string> {
        const user = await User.findOne({login: login});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        const pass = user.password;
        const encodePass = encodeBase64(password);
        if (pass !== encodePass) {
             throw new ForbiddenError(`Password not valid`);

        }

        const token = jwt.sign({login: user.login, roles: user.roles}, process.env.JWT_SECRET!,
            {expiresIn: '1h'});

        return token;
    }

    async changePassword(login: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
        const user = await User.findOne({login: login});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        const currPass = user.password;
        const decodePass = decodeBase64(currPass);
         if(decodePass !== currentPassword){
                throw new ForbiddenError(`Current password is wrong`);
        }
        if (decodePass === newPassword) {
            throw new ForbiddenError(`Your new password is too similar to one of your previous passwords`);
        }
        const encodePass = encodeBase64(newPassword);
        user.password = encodePass;
        await user.save();
        return {message: 'Password changed successfully'};


    }


}