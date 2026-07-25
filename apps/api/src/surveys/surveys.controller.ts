import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  SurveySubmissionSchema,
  type Survey,
  type SurveyQuestion,
  type SurveyResponseMetadata,
} from '@worksight/common';
import { SurveysService } from './surveys.service';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Get()
  getAll(): Promise<Survey[]> {
    return this.surveysService.findAll();
  }

  @Get('responses')
  getSubmissions(@Query('employee_id') employeeId?: string): Promise<SurveyResponseMetadata[]> {
    return this.surveysService.findSubmissions(employeeId);
  }

  @Get(':id/questions')
  getQuestions(@Param('id') id: string): Promise<SurveyQuestion[]> {
    return this.surveysService.findQuestions(id);
  }

  @Post(':id/responses')
  @HttpCode(201)
  submit(@Param('id') id: string, @Body() body: unknown): Promise<SurveyResponseMetadata> {
    const parsed = SurveySubmissionSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.surveysService.submit(id, parsed.data);
  }
}
