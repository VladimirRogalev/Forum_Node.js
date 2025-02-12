import {
    Body,
    Controller,
    Delete,
    Get,
    HeaderParam,
    Param,
    Post,
    Put,
    Res,
    UseBefore
} from 'routing-controllers';
import NewUserDto from '../dto/NewUserDto';
import UserServiceImpl from '../service/UserServiceImpl';
import UserService from '../service/UserService';
import {Response} from 'express';
import {AuthMiddleware} from '../Middleware/AuthMiddleware';


@Controller('/account')
export default class UserController {
   userService: UserService = new UserServiceImpl();

    @Post('/register')
    async register(@Body() newUserDto: NewUserDto){
        return this.userService.register(newUserDto);
    }

    @UseBefore(AuthMiddleware)
    @Post('/login')
    async login(@HeaderParam('Authorization') token:string,@Res() res: Response){
        // console.log(token);
        // res.status(200).send("Ok!")
        return this.userService.login(token);
    }

    @UseBefore(AuthMiddleware)
    @Delete('/user/:login')
    async removeUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.removeUserByLogin(login).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(AuthMiddleware)
    @Get('/user/:login')
    async getUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.getUserByLogin(login).catch((err: any)=> res.status(404).send(err));
    }

    @UseBefore(AuthMiddleware)
    @Get('/users')
    async getAllUser(@Res() res: Response) {
        return await this.userService.getAllUser().catch((err: any)=> res.status(404).send(err));
    }
    @UseBefore(AuthMiddleware)
    @Put('/user/:login')
    async updateUser(@Param('login')login: string,@Body()  updateUserDto: NewUserDto, @Res() res: Response) {
        return await this.userService.updateUser(login, updateUserDto.firstName, updateUserDto.lastName).catch((err: any)=> res.status(404).send(err));
    }

    @Put('/user/:login/role/:role')
    async addUserRole(@Param('login')login: string,@Param('role') role:string, @Res() res: Response) {
        return await this.userService.addUserRole(login, role).catch((err: any)=> res.status(404).send(err));
    }

    @Delete('/user/:login/role/:role')
    async removeRole(@Param('login')login: string,@Param('role') role:string, @Res() res: Response) {
        return await this.userService.removeRole(login, role).catch((err: any)=> res.status(404).send(err));
    }

}



