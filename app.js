const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers =  require('./graphql/resolvers/index');
const isAuth = require('./middleware/isAuth');

const app = express();
app.use(isAuth);
app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema ,
    rootValue:graphqlResolvers ,
    graphiql: true,
  }));


mongoose.connect('mongodb://localhost/BlogDB', 
{useNewUrlParser: true , useUnifiedTopology: true}, 
()=>{
    try {
        console.log('DataBase Connected')
    }catch(error){
        throw error
    };
});

app.use(bodyParser.json());
app.listen(4000, () => console.log('Server running at localhost:4000'));
