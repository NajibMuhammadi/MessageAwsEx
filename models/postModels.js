const Joi = require('joi');

const postSchema = Joi.object({
    username: Joi.string().trim().alphanum().min(3).max(30).required().messages({
        'string.empty': 'Username is not allowed to be empty',
        'any.required': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must be at most 30 characters long',
        'string.alphanum': 'Username must only contain alphanumeric characters'
    }),
    message: Joi.string().required()
});

module.exports = { postSchema };