var crypto = require('crypto');
var bcrypt = require('bcrypt');
var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        unique: false,
    },
    company: {
        type: String,
        unique: false
    },
    phone: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    urlSite: {
        type: String,
        unique: true,
    },
    hashedPassword: {
        type: String,
    },
    salt: {
        type: String,
    },
    status: {
        type: String,
        default: "client"
    },
    active: {
        type: Boolean,
        default: false
    },
    blocked: {
        type: Boolean,
        default: false
    },
    services: {
        metrika: {
            active: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
            },
            dateActive: {
                type: Date
            },
            dateDeActive: {
                type: Date,
                default: null
            }
        },
        webmaster: {
            active: {
                type: Boolean,
                default: false
            }
        }
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHash('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password').set(function (password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password + this.salt);
}).get(function () {
    return this._plainPassword;
});

schema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

schema.methods.checkPassword = function (password, salt) {
    return this.encryptPassword(password  + this.salt) === this.hashedPassword;
};

exports.User = mongoose.model('User', schema);