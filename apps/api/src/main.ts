import * as express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import * as http from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

import type { Message } from '@legendary-adventure/api-interfaces';

const greeting: Message = { message: 'Welcome to api!' };

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

// express server
const app = express();
app.get('/api', (req, res) => res.send(greeting));

async function startApolloServer(typeDefs, resolvers) {
  const httpServer = http.createServer(app);

  // apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  const port = process.env.port || 3333;
  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);
