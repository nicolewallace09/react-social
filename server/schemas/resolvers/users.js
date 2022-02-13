const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const { UserInputError } = require('apollo-server'); 
const { SECRET_KEY } = require('../../config/connection');
const { validateInput, validateLogin }  = require('../../utils/validators'); 

module.exports = {
    Mutation: {
        async login(parent, { username, password }) {
            const { errors, valid } = validateLogin(username, password); 
            if(!valid) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await User.findOne({ username }); 
            if(!user) {
                errors.login = 'User not found'; 
                throw new UserInputError('User not found', { errors }); 
            }

            const match = await bcrypt.compare(password, user.password); 
            if(!match) {
                errors.login = 'Wrong credentials'; 
                throw new UserInputError('Wrong credentials', { errors }); 
            }

            const token = jwt.sign({
                id: user.id, 
                email: user.email,
                username: user.username
            }, SECRET_KEY, { expiresIn: '1h'});
            return {
                ...user._doc, 
                id: user._id, 
                token
            }
        }, 
        async addUser(parent, { userInput: { username, email, password, confirmPassword }}) {
            // if user already exists 
            const {valid, errors } = validateInput(username, email, password, confirmPassword);
            if(!valid) {
                throw new UserInputError('Errors', { errors })
            }

            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: ' This username is taken'
                    }
                })
            }

            password = await bcrypt.hash(password, 12); 
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