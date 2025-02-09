import {Body, Controller, Delete, Get, Param, Post, Put, Res} from 'routing-controllers';
import NewUserDto from '../dto/NewUserDto';
import UserServiceImpl from '../service/UserServiceImpl';
import UserService from '../service/UserService';
import {Response} from 'express';
import UpdateUserDto from '../dto/UpdateUserDto';


@Controller('/account')
export default class UserController {
   userService: UserService = new UserServiceImpl();

    @Post('/register')
    async register(@Body() newUserDto: NewUserDto){
        return this.userService.register(newUserDto);
    }

    @Delete('/user/:login')
    async removeUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.removeUserByLogin(login).catch((err: any) => res.status(404).send(err));
    }

    @Get('/user/:login')
    async getUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.getUserByLogin(login).catch((err: any)=> res.status(404).send(err));
    }
    @Get('/users')
    async getAllUser(@Res() res: Response) {
        return await this.userService.getAllUser().catch((err: any)=> res.status(404).send(err));
    }

    @Put('/user/:login')
    async updateUser(@Param('login')login: string,@Body()  updateUserDto: UpdateUserDto, @Res() res: Response) {
        return await this.userService.updateUser(login, updateUserDto.firstName, updateUserDto.lastName).catch((err: any)=> res.status(404).send(err));
    }

    // @Put('/post/:id')
}



