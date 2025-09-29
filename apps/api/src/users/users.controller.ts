import { Controller, Get, Header, Param } from '@nestjs/common';
import { Roles } from '@worksight/common/types';
@Controller('users')
export class UsersController {
  @Get()
  getAll() {
    const role = Roles;
    return { message: `Hello, NestJS!`, anotherMessage: `Hi, Karlo!`, test: "balls", role };
  }

  @Get(':id')
  @Header('Content-Type', 'text/plain')
  getOne(@Param('id') id: string) {
    return `stuff ${id}`;
  }
}
