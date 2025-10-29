const Joi = require('joi');
const { errorResponse } = require('../utils/response');


const jobSubmissionSchema = Joi.object({
  task: Joi.string()
    .valid('calculate_primes', 'hash_text', 'sort_array', 'matrix_multiply', 'fibonacci')
    .required()
    .messages({
      'any.required': 'Task is required',
      'any.only': 'Task must be one of: calculate_primes, hash_text, sort_array'
    }),
  data: Joi.object().optional()
});


const jobIdSchema = Joi.object({
  jobId: Joi.string().uuid().required()
});

class ValidationMiddleware {

  validateJobSubmission(req, res, next) {
    const { error } = jobSubmissionSchema.validate(req.body);
    
    if (error) {
      return errorResponse(res, error.details[0].message, 400);
    }
    
    next();
  }

  validateJobId(req, res, next) {
    const { error } = jobIdSchema.validate(req.params);
    
    if (error) {
      return errorResponse(res, 'Invalid job ID format', 400);
    }
    
    next();
  }
}

module.exports = new ValidationMiddleware();
