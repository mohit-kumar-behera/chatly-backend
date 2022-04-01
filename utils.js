const jwt = require('jsonwebtoken');

const createToken = ({ name, mobileNumber }) => {
  return jwt.sign({ name, mobileNumber }, process.env.SECRET_KEY);
};

const generateID = () => Math.random().toString(32).slice(2);

module.exports = { createToken, generateID };
