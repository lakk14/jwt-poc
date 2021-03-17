const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('./init_redis');
const config = require('./../config.json');

module.exports = {
    signAccessToken: (email, role, user) => {
        return new Promise((resolve, reject) => {

            const payload = {
                sub: email,
                role: role,
                user: user
            };
            const secret = config.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "12h",
                issuer: "engineeringfitness.in",
                audience: email
            };

            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });

        })
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.header('Authorization')) return next(createError.Unauthorized());

        const authHeader = req.header('Authorization');
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];

        jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload;
            next();
        });
    },
    signRefreshToken: (email) => {
        return new Promise((resolve, reject) => {

            const payload = {};
            const secret = config.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: "1y",
                issuer: "engineeringfitness.in",
                audience: email
            };

            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    reject(createError.InternalServerError());
                }

                client.SET(email, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError())
                        return
                    }
                    resolve(token);
                })
            });
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return reject(createError.Unauthorized());
                const email = payload.aud;
                client.GET(email, (err, result) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError());
                        return
                    }
                    if (refreshToken === result) return resolve(email)
                    reject(createError.Unauthorized())
                })
            })
        })
    },
    getEmailFromToken: async (accessToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET, (err, payload) => {
                if (err) return reject(createError.Unauthorized());
                const email = payload.aud;
                resolve(email);
            })
        })
    }
}