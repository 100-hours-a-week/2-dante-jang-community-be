import ResponseDto from "./ResponseDto";

export default class WritePostResponseDto extends ResponseDto {
    constructor(message, postId) {
        super(message, postId);
    }
}