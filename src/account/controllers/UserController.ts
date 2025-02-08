import {Body, Controller, Get, Param, Post, Res} from 'routing-controllers';
import NewUserDto from '../dto/NewUserDto';
import UserServiceImpl from '../service/UserServiceImpl';
import UserService from '../service/UserService';


@Controller('/account')
export default class UserController {
   userService: UserService = new UserServiceImpl();

    @Post('/register')
    async register(@Body() newUserDto: NewUserDto){
        return this.userService.register(newUserDto);
    }



    // @Put('/post/:id')
}



