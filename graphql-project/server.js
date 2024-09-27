const path = require('path');
const express = require('express');
const { graphqlHTTP } = require('express-graphql'); // Import the graphqlHTTP function from the express-graphql package
const { makeExecutableSchema } = require('@graphql-tools/schema'); // Import the makeExecutableSchema function
const { loadFilesSync } = require('@graphql-tools/load-files');

// Load type definitions from .graphql files
const typesArray = loadFilesSync(path.join(__dirname, './**/*.graphql'));

// Create schema using the loaded type definitions
const schema = makeExecutableSchema({
  typeDefs: typesArray
});

const app = express();

// Import model data
const products = require('./products/products.model');
const orders = require('./orders/orders.model');

// Define resolvers
const root = {
  products: require('./products/products.model'),
  orders: require('./orders/orders.model'),
};

// Set up GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

// Start the server
app.listen(3000, () => {
  console.log('Running our GraphQL API Server at http://localhost:3000/graphql');
});
