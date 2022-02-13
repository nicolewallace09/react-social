const jwt = require('jsonwebtoken'); 
const { SECRET_KEY } = require('../config/connection');
const  { AuthenticationError } = require('apollo-server');  

module.exports = (context) => {
    const auth = context.req.headers.authorization; 
    if(auth) {
        const token = auth.split('Bearer ')[1]; 
        if(token) {
            try{
                const user = jwt.verify(token, SECRET_KEY); 
                return user;
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        }
        throw new Error(`Authentication token must be 'Bearer [token]`)
    }
    throw new Error('Authorization header must be provided')
}