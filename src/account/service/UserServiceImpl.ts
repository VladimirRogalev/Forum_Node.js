import UserService from './UserService';
import NewUserDto from '../dto/NewUserDto';
import UserDto from '../dto/UserDto';
import {User} from '../model/User';
import {NotFoundError} from 'routing-controllers';

export default class UserServiceImpl implements UserService{
    async register(newUserDto: NewUserDto): Promise<UserDto> {
        const newUser = new User ({
            ...newUserDto
        })
        const res = await newUser.save();


        return new UserDto(res.login,res.firstName,res.lastName, res.roles);
    }

   async removeUserByLogin(login: string): Promise<UserDto> {

       const user = await User.findOne({login:login});
       if (user === null) {
           throw new NotFoundError(`User with login ${login} not found`);
       }
       await user.deleteOne();
       return new UserDto(user.login,user.firstName,user.lastName, user.roles);
    }



}