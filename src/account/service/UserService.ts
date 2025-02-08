import NewUserDto from '../dto/NewUserDto';
import UserDto from '../dto/UserDto';

export default interface UserService {

    register(newUserDto: NewUserDto): Promise<UserDto>;
}