const { ApolloServer } = require('apollo-server');
// ORM for mongo
const mongoose = require('mongoose'); 

const typeDefs = require('./schemas/typeDefs'); 
const resolvers = require('./schemas/resolvers'); 
const { MONGODB } = require('./config/connection');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req})
});

const PORT = process.env.PORT || 3001; 

mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({ port: PORT })
    })
    .then(() => {
        console.log(`Server running on PORT ${PORT}`)
    })

