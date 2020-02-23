const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post{
        _id : ID!
        title : String!
        description : String!
        creator : User!
    }

    type User{
        _id : ID!
        email : String!
        password: String
        createdPosts: [Post!]
    }

    type AuthData{
        userId :ID!
        token : String!
        tokenExpiration : Int!  
    }

    input UserInput{
        email : String!
        password : String!
    }

    input PostInput{
        title : String 
        description : String 
    }

    type RootQuery{
        posts:[Post!]!
        login(email : String! password : String!): AuthData!
    }

    type RootMutation{
        createPost( postInput : PostInput) : Post
        createUser( userInput : UserInput) : User
    }

    schema {
        query: RootQuery
        mutation: RootMutation 
    }
    `)