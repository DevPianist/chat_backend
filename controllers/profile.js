const User = require('../models/user');

// get the unser info from db
const info = async id => {
    const user = await User.findById(id);
    if (!user) throw new Error('user not found');
    return user;
};

module.exports = {
    info
};