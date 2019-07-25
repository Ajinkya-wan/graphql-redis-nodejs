const express = require('express');
const bodyParser = require('body-parser');
var graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
import redis from 'redis';
import bluebird from 'bluebird';


import typeDefs from './schema'
import resolvers from './resolvers'


// Some fake data
const books = [
    {
        title: "Harry Potter and the Sorcerer's stone",
        author: 'J.K. Rowling',
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];

// // The GraphQL schema in string form
// const typeDefs = `
//   type Query { books: [Book] }
//   type Book { title: String, author: String }
// `;
//
// // The resolvers
// const resolvers = {
//     Query: { books: () => books },
// };

const client = redis.createClient();
bluebird.promisifyAll(redis);
// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", (err)=> {
    console.log("Error " + err);
});




// Put together a schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

// Initialize the app
const app = express();

// The GraphQL endpoint
// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
// app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context :{client}
}));

// Start the server
app.listen(3005, () => {
    console.log('Go to http://localhost:3005/graphql to run queries!');
});
