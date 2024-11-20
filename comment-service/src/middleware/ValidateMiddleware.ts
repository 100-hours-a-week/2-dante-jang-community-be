import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validationMiddleware(type: any) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dtoObj = plainToInstance(type, req.body);
            const errors = await validate(dtoObj);

            if (errors.length > 0) {
                const errorMessages = errors.map(err =>
                    Object.values(err.constraints || {}).join(", ")
                );
                res.status(400).json({
                    message: "Validation failed",
                    errors: errorMessages,
                });
                return;
            }

            next();
        } catch (err) {
            next(err);
        }
    };
}