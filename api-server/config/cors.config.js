// Allowed origins
const whitelist = [
  "https://yourdomain.com",
  "http://127.0.0.1:5000"
];

// !origin for dev enviroment only
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      // Make sure to remove "!origin" when pushed to production
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} was blocked by CORS`));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
