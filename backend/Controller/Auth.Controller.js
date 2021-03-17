const bcrypt = require('bcryptjs');
const { response } = require('../helpers/response');
const User = require('../Models/User');
const { signAccessToken, signRefreshToken } = require('../helpers/jwt_helper');

module.exports = {
    register: async (req, res, next) => {
        try {
            //Email Exist Check
            const emailExist = await User.findOne({ email: req.body.email });
            if (emailExist) return res.status(400).send(response(400, 'Email Already Registered', null));
            //Mobile Exist Check
            const mobileExist = await User.findOne({ mobile: req.body.mobile });
            if (mobileExist) return res.status(400).send(response(400, 'Mobile Already Exist', null));

            //Hash passwords
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            //Create User
            const user = new User({
                email: req.body.email,
                password: hashedPassword,
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                mobile: req.body.mobile,
                gender: req.body.gender,
                address: req.body.address,
                role: "Client"
            });

            const savedUser = await user.save();

            if (savedUser != undefined && savedUser != null) {
                const accessToken = await signAccessToken(savedUser.email, savedUser.role, savedUser);
                const refreshToken = await signRefreshToken(savedUser.email);
                return res.status(200).send(response(200, 'OK', { accessToken, refreshToken }));
            }
        } catch (err) {
            console.log(err);
            return res.status(400).send(response(400, 'Something went wrong :(', null));
        }
    },
    login: async (req, res, next) => {

        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send(response(400, 'All fields are required', null));

        //Email Exist Check
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).send(response(400, 'Email Not Found', null));

        //PasswordIsCorrect
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).send(response(400, 'Invalid credentials', null));

        //assign token
        const accessToken = await signAccessToken(user.email, user.role, user);
        const refreshToken = await signRefreshToken(user.email);

        if (accessToken != undefined && refreshToken != undefined) {
            return res.status(200).send(response(200, 'OK', { accessToken, refreshToken }));
        } else {
            return res.status(400).send(response(400, 'Something went wrong', null));
        }

    },
};