// const User
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'SK123';
const User = require('../models/user');
const moment = require('moment');
exports.home = (req, res) => {
    res.render('index');
}
exports.access = async(req, res, next) => {
    res.send({ message: "sad" });
}
exports.getInfo = async(req, res, next) => {
    const token = req.headers['authorization'];
    const us = jwt.decode(token, 'SK123');
    const id = us.email;
    const user = await User.findOne({ email: id });
    if (!user) {
        res.status(509).send({ message: 'Error al obtener los datos' });
        next();
    }
    console.log("get infoooo");
    res.send(user);
    next();
}
exports.loginUser = async(req, res, next) => {
    try {
        //evaluar si el usuario existe
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(409).send({ message: 'No existe un usuario registrado con ese correo' });
        } else {
            const resultPassword = bcrypt.compareSync(req.body.password, user.password);
            if (resultPassword) {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({
                        id: user.id,
                        email: req.body.email,
                        iat: moment().unix(), //Guardamos la fecha en formato unix
                        //Fecha de expiracion del token
                        exp: moment().add(10, 'days').unix()
                    },
                    SECRET_KEY);
                const dataUser = {
                    name: user.name,
                    email: user.email,
                    token: accessToken
                }
                res.send(dataUser);

            } else {
                //password wrong
                res.status(409).send({ message: 'Contraseña incorrecta' })
            }
        }
    } catch (error) {
        res.status(500).send({ message: 'Server Error' });
    }
}
exports.registerUser = async(req, res, next) => {
    try {
        const expiresIn = 24 * 60 * 60;
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
        })

        // res.send('register');
        // User.create(newUser, (err, user) => {
        // newUser.save(err, user);
        let email = await User.findOne({ email: req.body.email });
        // if (err) return res.status(500).send('Server Error');
        // if (err && err.code === 11000) return res.status(409).send({ message: 'Email en uso' }); //si es que activamos unique:true en un campo este error nos saldra cuando se repita el valor
        if (!email) {
            let user = await newUser.save();
            const accessToken = jwt.sign({
                    id: user.id,
                    email: req.body.email,
                    iat: moment().unix(), //Guardamos la fecha en formato unix
                    //Fecha de expiracion del token
                    exp: moment().add(10, 'days').unix()
                },
                SECRET_KEY);
            const dataUser = {
                name: user.name,
                email: user.email,
                token: accessToken
            }
            res.send(dataUser);
        } else {
            res.status(409).send({ message: 'Correo en uso' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Server Error' });
    }
}