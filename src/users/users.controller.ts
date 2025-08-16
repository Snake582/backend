import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ Route admin-only
  @Get('admin-only')
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  getAdminData() {
    return 'Données réservées à l’admin';
  }

  // ✅ Route pour récupérer l'utilisateur connecté
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: Request) {
    const { userId } = req.user as { userId: number }; // récupère l'ID depuis le JWT

    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Exclude password from the returned user object
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // ✅ Créer un utilisateur
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // ✅ Récupérer tous les utilisateurs (admin uniquement)
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  findAll() {
    return this.userService.findAll();
  }

  // ✅ Récupérer un utilisateur par ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // ✅ Mettre à jour un utilisateur
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  // ✅ Supprimer un utilisateur
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
