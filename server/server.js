const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose'); 

const typeDefs = require('./schemas/typeDefs'); 
const resolvers = require('./schemas/resolvers'); 
const { MONGODB } = require('./config.js/connection');

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const PORT = process.env.PORT || 3001; 

mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('MongoDB Connected');
        return server.listen({ port: PORT })
    })
    .then((res) => {
        console.log(`Server running on PORT ${res.url}`)
    })

