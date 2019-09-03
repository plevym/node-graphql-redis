const PAIR_ADDED = 'PAIR_ADDED'
const PAIR_MODIFIED = 'PAIR_MODIFIED'

const resolvers = {
	Query: {
		get(_, args, context) {
			try {
				let value = context.redis.get(args.key)
				return {
					key: args.key,
					value: value,
				}
			} catch (e) {
				console.log(e)
			}
		},
	},

	Mutation: {
		async set(_, args, context) {
			try {
				let value = await context.redis.get(args.key)
				if (value == null) {
					await context.redis.set(args.key, args.value, 'ex', 3600)
					context.pubsub.publish(PAIR_ADDED, { pairAdded: { key: args.key, value: args.value } })
				} else {
					await context.redis.set(args.key, args.value, 'ex', 3600)
					context.pubsub.publish(PAIR_MODIFIED, { pairModified: { key: args.key, value: args.value } })
				}
				return args
			} catch (e) {
				console.log(e)
			}
		},
	},

	Subscription: {
		pairAdded: {
			subscribe(_, args, context) {
				return context.pubsub.asyncIterator([PAIR_ADDED])
			}
		},
		pairModified: {
			subscribe(_, args, context) {
				return context.pubsub.asyncIterator([PAIR_MODIFIED])
			}
		}
	}
}

module.exports = {
	resolvers,
}