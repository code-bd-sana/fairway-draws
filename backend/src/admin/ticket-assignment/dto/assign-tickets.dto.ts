import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignTicketsDto {
  @ApiProperty({ description: 'The ID of the competition/raffle to assign tickets for' })
  @IsString()
  @IsNotEmpty()
  raffleId: string;

  @ApiProperty({ description: 'The ID of the user recipient to receive the tickets' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({
    description: 'Specific ticket numbers to assign (e.g. [7, 14, 21])',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Type(() => Number)
  ticketNumbers?: number[];

  @ApiPropertyOptional({
    description: 'Random available ticket quantity if specific numbers are omitted',
    type: Number,
    example: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Optional admin notes/reason (e.g. Giveaway prize, Loyalty reward)',
    example: 'Giveaway winner - October Instagram campaign',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
