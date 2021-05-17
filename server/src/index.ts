require('dotenv').config();

import 'reflect-metadata';
import { Db, MongoClient } from 'mongodb';
import {
	DATABASE_INSTANCE_KEY,
	DB_URL_STRING,
	logger,
	PORT,
} from './config';
import express from 'express';
import { getApolloServer, getGraphqlSchema } from './apolloServer';
import { createServer } from 'http';

const app = express();

const bootstrap = async () => {
	const schema = await getGraphqlSchema();

	const apolloServer = getApolloServer(schema);
	apolloServer.applyMiddleware({ app });

	const server = createServer(app);

	apolloServer.installSubscriptionHandlers(server);

	server.listen(PORT, () => {
		logger.info(
			`Server is running, Graphql Playground is available at port ${PORT}`
		);
	});

	return apolloServer;
};

MongoClient.connect(
	DB_URL_STRING,
	{
		useUnifiedTopology: true,
	},
	(error) => {
		if (error) {
			logger.error(error.message);
			process.exit(1);
		}
		logger.info('Connected successfully to database');
		bootstrap();
	}
);
