const mongoose = require('mongoose');

const DATABASE_CONNECTION = process.env.URL_MONGO;

const clientOptions = {
  useNewUrlParser   : true,
  dbName            : 'umaishop'
};

initClientDbConnection = async () => {
  try {
      await mongoose.connect(DATABASE_CONNECTION, clientOptions)
      console.log('Connected');
  } catch (error) {
      console.log(error);
      throw error;
  }
}

module.exports = {
  initClientDbConnection: initClientDbConnection
}