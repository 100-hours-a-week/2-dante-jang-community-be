const ResponseDto = require("../../ResponseDto");

class GetImageResponseDto extends ResponseDto {
    constructor(imgUrl) {
        super();
        this.imgUrl = imgUrl;
    }
};

module.exports = GetImageResponseDto;