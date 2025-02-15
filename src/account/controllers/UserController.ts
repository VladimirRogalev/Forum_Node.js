import {Body, Delete, Get, JsonController, Param, Post, Put, Req, Res, UseBefore} from 'routing-controllers';
import NewUserDto from '../dto/NewUserDto';
import UserServiceImpl from '../service/UserServiceImpl';
import UserService from '../service/UserService';
import {Response, Request} from 'express';
import {AuthenticationMiddleware} from '../Middleware/AuthenticationMiddleware';
import {AuthorizationMiddleware} from '../Middleware/AuthorizationMiddleware';
import PasswordDto from '../dto/PasswordDto';



@JsonController('/account')
export default class UserController {
    userService: UserService = new UserServiceImpl();

    @Post('/register')
    async register(@Body() newUserDto: NewUserDto) {
        return this.userService.register(newUserDto);
    }


    // @UseBefore(AuthenticationMiddleware)
    @Post('/login')
    async login(@Body() loginDto: { login: string, password: string }, @Res() res: Response) {
        const token = await this.userService.login(loginDto.login, loginDto.password).catch((err: any) => res.status(404).send(err));
        return res.json({token});
    }


    @UseBefore(AuthorizationMiddleware)
    @Delete('/user/:login')
    async removeUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.removeUserByLogin(login).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/user/:login')
    async getUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.getUserByLogin(login).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthenticationMiddleware)
    @Get('/users')
    async getAllUser(@Res() res: Response) {
        return await this.userService.getAllUser().catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthorizationMiddleware)
    @Put('/user/:login')
    async updateUser(@Param('login') login: string, @Body() updateUserDto: NewUserDto, @Res() res: Response) {
        return await this.userService.updateUser(login, updateUserDto.firstName, updateUserDto.lastName).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthorizationMiddleware)
    @Put('/user/:login/role/:role')
    async addUserRole(@Param('login') login: string, @Param('role') role: string, @Res() res: Response) {
        return await this.userService.addUserRole(login, role).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthorizationMiddleware)
    @Put('/password/:login')
    async changePassword(@Param('login') login: string,@Body() passwordDto:PasswordDto, @Res() res: Response) {
        return await this.userService.changePassword(login, passwordDto.currentPassword, passwordDto.newPassword).catch((err: any) => res.status(404).send(err));
    }
    @UseBefore(AuthorizationMiddleware)
    @Delete('/user/:login/role/:role')
    async removeRole(@Param('login') login: string, @Param('role') role: string, @Res() res: Response) {
        return await this.userService.removeRole(login, role).catch((err: any) => res.status(404).send(err));
    }

}



