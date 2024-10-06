import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  @Length(3, 15)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  status?: boolean;

  authorId: number;
}
