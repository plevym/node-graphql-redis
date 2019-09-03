const { gql } = require('apollo-server')

const typeDefs = gql`
type Query {
	get(key: String!): Pair
}

type Mutation {
	set(key: String!, value: String!): Pair!
}

type Subscription {
	pairAdded: Pair
	pairModified: Pair
}

type Pair {
	key: String
	value: String
}
`

module.exports = {
	typeDefs,
}