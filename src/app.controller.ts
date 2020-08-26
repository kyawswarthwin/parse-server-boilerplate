import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  root() {}
}
