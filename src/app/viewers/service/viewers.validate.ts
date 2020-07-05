import * as Joi from "@hapi/joi";

export class ViewersValidate {

    static getValidator(): Joi.ObjectSchema {
        return Joi.object({
            _gameId: Joi.number().required(),
            _gameName: Joi.string().required(),
            _viewers: Joi.number().required()
        });
    }
}