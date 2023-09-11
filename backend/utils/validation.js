const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const errorMessage = req.message
    if(errorMessage){
    err = Error(errorMessage);}
    else{
      err = Error('Bad Request')
    }

    const errorStatus = req.status
    if(errorStatus){
    err.status = errorStatus;}
    else{
      err.status = 400;
    }


    err.errors = errors;
    err.title = "Bad request.";
    delete err.stack;
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors
};
