const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = (req, res, next) => {
    //header
    const authHeader = req.headers['authorization'];
    // console.log(authHeader);
    if (!authHeader) {
        const error = new Error('No autenticado, no hay JWT');
        error.statusCode = 509;
        // throw error;
        return res.status(509).send({ message: 'Su sesión caducó' });
    }
    //obtener
    const token = authHeader;
    let revisarToken;
    try {
        // revisarToken = jwt.verify(token, 'SK123')
        var payload = jwt.decode(token, 'SK123');
        if (payload.exp <= moment().unix()) {
            return res.status(509).send({ message: 'Su sesión caducó' });
        }
    } catch (error) {
        error.statusCode = 509;
        return res.status(509).send({ message: 'Su sesión caducó' });
        // throw error;
    }
    // if (!revisarToken) {
    //     const error = new Error("No autenticado");
    //     error.statusCode = 509;
    //     throw error;
    // }
    next();
}