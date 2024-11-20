import { Type } from "class-transformer";
import { IsNumber, IsString, IsNotEmpty } from "class-validator";

export class WriteCommentDto {
    @IsNotEmpty({ message: "userId must be required" })
    @IsNumber({}, { message: "userId must be a number" })
    @Type(() => Number)
    userId!: number;

    @IsNotEmpty({ message: "postId must be required" })
    @IsNumber({}, { message: "postId must be a number" })
    @Type(() => Number)
    postId!: number;

    @IsNotEmpty({ message: "content must be required" })
    @IsString({ message: "content must be a string" })
    content!: string;
}