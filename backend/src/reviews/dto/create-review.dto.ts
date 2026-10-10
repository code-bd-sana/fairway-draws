import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'The unique winner record ID' })
  @IsString()
  @IsNotEmpty()
  winnerId: string;

  @ApiProperty({ description: 'Rating scale from 1 to 5', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Optional feedback comment' })
  @IsString()
  @IsOptional()
  comment?: string;
}
