const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const { UserInputError } = require('apollo-server'); 
const { SECRET_KEY } = require('../../config.js/connection');

module.exports = {
    Mutation: {
        async addUser(parent, { userInput: { username, email, password, confirmPassword }}) {
            password = await bcrypt.hash(password, 12); 
            const user = User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: ' This username is taken'
                    }
                })
            }
            const newUser = new User({
                email, 
                username,
                password, 
                createdAt: new Date().toISOString() 
            })
            const res = await newUser.save(); 
            const token = jwt.sign({
                id: res.id, 
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h'});
            return {
                ...res._doc, 
                id: res._id, 
                token
            }
        }
    }
}