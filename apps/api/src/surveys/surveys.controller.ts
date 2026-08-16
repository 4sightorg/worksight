import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  SurveySubmissionSchema,
  type Survey,
  type SurveyQuestion,
  type SurveyResponseMetadata,
} from '@worksight/common';
import { parsePaginationParams } from '../common/pagination.dto';
import { ParseOptionalUUIDPipe } from '../common/parse-optional-uuid.pipe';
import {
  SurveyDto,
  SurveyQuestionDto,
  SurveyResponseMetadataDto,
  SurveySubmissionDto,
} from '../openapi/schemas';
import { SurveysService } from './surveys.service';

@ApiTags('surveys')
@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Get()
  @ApiOperation({ summary: 'List survey templates' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit count' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset count' })
  @ApiOkResponse({ type: SurveyDto, isArray: true })
  getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<Survey[]> {
    return this.surveysService.findAll(parsePaginationParams(limit, offset));
  }

  @Get('responses')
  @ApiOperation({ summary: 'List survey submissions' })
  @ApiQuery({
    name: 'employee_id',
    required: false,
    format: 'uuid',
    description: 'When set, only submissions from this employee',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit count' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset count' })
  @ApiOkResponse({ type: SurveyResponseMetadataDto, isArray: true })
  getSubmissions(
    @Query('employee_id', ParseOptionalUUIDPipe) employeeId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ): Promise<SurveyResponseMetadata[]> {
    return this.surveysService.findSubmissions(employeeId, parsePaginationParams(limit, offset));
  }

  @Get(':id/questions')
  @ApiOperation({ summary: 'List questions for a survey' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Survey id' })
  @ApiOkResponse({ type: SurveyQuestionDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Survey not found' })
  getQuestions(@Param('id', ParseUUIDPipe) id: string): Promise<SurveyQuestion[]> {
    return this.surveysService.findQuestions(id);
  }

  @Post(':id/responses')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Submit survey answers',
    description:
      'Validates the body with SurveySubmissionSchema. avg_score is the mean of numeric answers.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Survey id' })
  @ApiBody({ type: SurveySubmissionDto })
  @ApiCreatedResponse({ type: SurveyResponseMetadataDto })
  @ApiBadRequestResponse({ description: 'Invalid submission payload' })
  @ApiNotFoundResponse({ description: 'Survey not found' })
  submit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SurveySubmissionDto
  ): Promise<SurveyResponseMetadata> {
    const parsed = SurveySubmissionSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues);
    }
    return this.surveysService.submit(id, parsed.data);
  }
}
