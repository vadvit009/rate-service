import { Controller, Post, Body } from '@nestjs/common';
import { ConvertService } from './convert.service';
import { ConvertInDto } from './dto/convert.dto';

@Controller('convert')
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Post()
  getConvertion(@Body() convertDto: ConvertInDto) {
    return this.convertService.getConvertion(convertDto);
  }
}