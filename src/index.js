const { ApolloServer, PubSub, gql } = require('apollo-server')
const RedisServer = require('ioredis')
const pubsub = new PubSub()
const redis = new RedisServer()
const listener = new RedisServer()
const { typeDefs } = require('./typedefs')
const { resolvers } = require('./resolvers')

listener.subscribe('PAIR_ADDED')

listener.on('message', (channel, message) => {
  console.log(`received message ${message} on channel ${channel}`)
  pubsub.publish(channel, { pairAdded: JSON.parse(message) })
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    redis,
    pubsub,
  },
  formatError: error => {
    console.log(error);
    return error;
  },
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})