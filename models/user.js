var crypto = require('crypto');
var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    company: String,
    phone: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    site: {
        type: String,
        unique: true,
    },
    hashedPassword: String,
    salt: String,
    status: {
        type: String,
        default: "client"
    },
    dateReg: Date,
    dateActive: Date,
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
            id: {
                type: String,
                unique: true
            },
            create_time: Date
        },
        ap: {
            reports: [{
                date: Date,
                data: [{
                    inquiry: String,
                    frequency: String,
                    yp: String,
                    gp: String
                }],
                sum: String,
                discount: String,
                totalSum: String
            }]
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