const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
}, {
    timestamps: true
});
// mongoose.set('useCreateIndex', true)

module.exports = mongoose.model('Users', userSchema);