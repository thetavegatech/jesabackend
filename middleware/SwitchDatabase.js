const mongoose = require('mongoose');

const dbConnections = {};

const connectToDatabase = async (uri) => {
  if (dbConnections[uri]) {
    return dbConnections[uri];
  }

  const connection = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  dbConnections[uri] = connection;
  return connection;
};

const switchDatabase = async (req, res, next) => {
  const orgIdentifier = req.headers['x-org-id']; // Assume org ID is sent in a custom header
  let mongoUri;

  switch (orgIdentifier) {
    case 'org1':
      mongoUri = process.env.MONGO_URI_ORG1;
      break;
    case 'org2':
      mongoUri = process.env.MONGO_URI_ORG2;
      break;
    default:
      return res.status(400).send('Invalid organization identifier');
  }

  try {
    const connection = await connectToDatabase(mongoUri);
    req.dbConnection = connection;
    console.log("connect to database")
    next();
  } catch (error) {
    res.status(500).send('Database connection error');
  }
};

module.exports = switchDatabase;
