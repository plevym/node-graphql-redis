const { ApolloServer, PubSub, gql } = require('apollo-server')
const { makeExecutableSchema } = require('graphql-tools')
const RedisServer = require('ioredis')
const pubsub = new PubSub()
const redis = new RedisServer()
const { typeDefs } = require('./typedefs')
const { resolvers } = require('./resolvers')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const server = new ApolloServer({
  schema,
  context: {
  	redis,
  	pubsub,
  },
  formatError: error => {
    console.log(error);
    return error;
  },
})

server.listen().then(({url}) => {
	console.log(`Server ready at ${url}`)
})