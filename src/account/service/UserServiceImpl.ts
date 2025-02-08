import UserService from './UserService';
import NewUserDto from '../dto/NewUserDto';
import UserDto from '../dto/UserDto';
import {User} from '../model/User';

export default class UserServiceImpl implements UserService{
    async register(newUserDto: NewUserDto): Promise<UserDto> {
        const newUser = new User ({
            ...newUserDto
        })
        const res = await newUser.save();


        return new UserDto(res.login,res.firstName,res.lastName, res.roles);
    }



}