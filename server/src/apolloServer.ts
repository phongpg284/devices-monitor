import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import path from 'path';
import { GraphQLSchema } from 'graphql';
export const getGraphqlSchema = async (): Promise<GraphQLSchema> => {
	const globPathNameToGraphQLResolverFiles = '**/api/**/+([A-Za-z]).{ts,js}';

	return buildSchema({
		resolvers: [path.join(__dirname, globPathNameToGraphQLResolverFiles)],

		// emitSchemaFile: path.resolve(__dirname, '../../webApp/schema.graphql'),
		validate: false,
	});
};

export const getApolloServer = (schema: GraphQLSchema): ApolloServer => {
	return new ApolloServer({
		schema,
		playground: process.env.NODE_ENV === 'production' ? false : true,
		subscriptions: {
			path: '/subscription',
		},
	});
};
