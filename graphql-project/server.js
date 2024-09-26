const express = require('express');
const {buildSchema} = require('graphql'); // Import the buildSchema function from the graphql package, allows use to build schema for our API
const {graphqlHTTP} = require('express-graphql'); // Import the graphqlHTTP function from the express-graphql package, allows us to use GraphQL with Express


const schema = buildSchema(`
  type Query {
    description: String
    price: Float
  }
`);

const app = express();

const root = {
    description: () => {
        return 'Red T-Shirt';
    },
    price: () => {
        return 5.99;
    }
};


app.use('/graphql',graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(3000, () => {
  console.log('Running our GrapphQL API Server at http://localhost:3000/graphql');
});
