const { response } = require('../helpers/response');
const User = require('../Models/User');
const createError = require('http-errors');
const jwt = require('../helpers/jwt_helper');
const bcrypt = require('bcryptjs');


module.exports = {
    getUserDetails: async (req, res, next) => {
        try {
            const email = req.params.email;
            const user = await User.findOne({ email: email });
            if (!user) return res.status(400).send(response(400, 'Email Not Found', null));
            const finalUser = {
                email: user.email,
                fullname: user.first_name + ' ' + user.last_name,
                firstname: user.first_name,
                lastname: user.last_name,
                mobile: user.mobile,
                gender: user.gender,
                address: user.address,
            };
            return res.status(200).send(response(200, 'OK', finalUser));
        } catch (err) {
            console.log(err.message);
            next(createError.InternalServerError());
        }
    },
}