const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

// Start express app
const app = express();

// setting up pug template
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Global Middlewares
// Serving static file
// app.use(express.static(`${__dirname}/public`));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Set security HTTP headers
app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
// app.use(helmet({ contentSecurityPolicy: false }));

// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 🖐');
//   next();
// });

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);
  next();
});
// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server side!');
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this end point...');
// });

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );
// 2. Route Handlers
//

// 3. Routes

// const tourRouter = express.Router();
// const userRouter = express.Router();
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handles all wrong url address
app.all('*', (req, res, next) => {
  // sample 1
  // res.status('404').json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  //sample 2
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
  // sample 3
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id/:x/:y?')

// app.post('/api/v1/tours', createTour);
// app.patch('api/v1/tours/:id', updateTour);
// app.delete('api/v1/tours/:id', deleteTour);

// tourRouter.route('/').get(getAllTours).post(createTour);

// app.route('api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
// app.get('/api/v1/tours/:id', getTour);

app.use(globalErrorHandler);
// 4. Server

module.exports = app;
