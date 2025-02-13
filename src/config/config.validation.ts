import * as Joi from 'joi';

// https://docs.nestjs.com/techniques/configuration#schema-validation
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3777),
  // TODO: work on validation schema for environment files
});
