const users = [];
const activeUsers = [];

const addUser = ({ name, mobileNumber }) => {
  const existingUser = users.find(user => user.mobileNumber === mobileNumber);

  if (existingUser)
    return {
      error: { status: false, message: 'Account with number already exists' },
    };

  const user = { name, mobileNumber };
  users.push(user);

  return { user };
};

const addUserToActiveBucket = ({ name, mobileNumber }) => {
  const existingActiveUser = activeUsers.find(
    user => user.mobileNumber === mobileNumber
  );

  if (existingActiveUser) return;

  const user = { name, mobileNumber };
  activeUsers.push(user);

  return user;
};

const getUser = mobileNumber =>
  users.find(user => user.mobileNumber === mobileNumber);

const getActiveUsers = () => activeUsers;

const getActiveUser = mobileNumber =>
  activeUsers.find(user => user.mobileNumber === mobileNumber);

const removeUser = mobileNumber => {
  const idx = users.findIndex(user => user.mobileNumber === mobileNumber);

  if (idx !== -1) return users.splice(idx, 1)[0];
};

const removeActiveUser = mobileNumber => {
  const idx = activeUsers.findIndex(user => user.mobileNumber === mobileNumber);

  if (idx !== -1) return activeUsers.splice(idx, 1)[0];

  return false;
};

module.exports = {
  addUser,
  addUserToActiveBucket,
  removeUser,
  getUser,
  getActiveUsers,
  getActiveUser,
  removeActiveUser,
};
