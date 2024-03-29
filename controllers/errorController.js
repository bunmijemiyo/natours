const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.path;
  const value = err.message.match(/(["'])(\\?.)*?\1/);

  // console.log(value);
  const message = `Duplicate fields value, ${value} Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token!. Please login again', 401);

const JWTExpiredError = () =>
  new AppError('Your token has expired. Please login again', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  // Operational, trusted error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
    // console.log(`error code: ${err.code}`);
    // console.log(`error message: ${err.message}`);
    // console.log(`error name: ${err.name}`);
  }
  // B) Rendered website
  console.error('ERROR 😣', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: don't leak error details
    }
    // 1) Log error
    console.error('ERROR 😣', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  // B) Rendered Website
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });

    // Programming or other unknown error: don't leak error details
  }
  // 1) Log error
  console.error('ERROR 😣', err);

  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log('production Environment...');
    // eslint-disable-next-line prefer-const, node/no-unsupported-features/es-syntax
    let error = { ...err };
    error.message = err.message;

    const { CastError } = mongoose;
    // if (err instanceof CastError) console.log('I catch you');

    // if (error.name === 'CastError') error = handleCastErrorDB(error);
    // sendErrorProd(error, res);

    if (err instanceof CastError) {
      error = handleCastErrorDB(error);
    }

    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(err);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
      error = JWTExpiredError();
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }

    // console.log(err.message);
    // console.log(error.message);
    sendErrorProd(error, req, res);

    // console.log(err.name);
    // console.log(err);
  }
};
