import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';

let todos = [
    { id: "1", title: "Initial Task", completed: false }
];

let users = [ 
    { id: "1", name: "Aniket", age: 25 }
];

async function startServer() {
    const app = express();
    
    const server = new ApolloServer({
        typeDefs: `#graphql
            type Todo {
                id: ID!
                title: String!
                completed: Boolean!
            }

            type User {
               id: ID!
               name: String!
               age: Int!
            }

            type Query {  
                getTodo: [Todo]
                getUser: [User]
            }

            type Mutation {
                createTodo(title: String!): Todo
                updateTodo(id: ID!, title: String, completed: Boolean): Todo
                deleteTodo(id: ID!): Todo
            }
        `,
        resolvers: {
            Query: {
                getTodo: () => todos,
                getUser: () => users
            },
            Mutation: {
                createTodo: (_, { title }) => {
                    const newTodo = { id: String(todos.length + 1), title, completed: false };
                    todos.push(newTodo);
                    return newTodo;
                },
                updateTodo: (_, { id, title, completed }) => {
                    const todoIndex = todos.findIndex(t => t.id === id);
                    if (todoIndex === -1) return null;

                    if (title !== undefined) todos[todoIndex].title = title;
                    if (completed !== undefined) todos[todoIndex].completed = completed;

                    return todos[todoIndex];
                },
                deleteTodo: (_, { id }) => {
                    const todoIndex = todos.findIndex(t => t.id === id);
                    if (todoIndex === -1) return null;
                    
                    const deletedArray = todos.splice(todoIndex, 1);
                    return deletedArray[0]; 
                }
            }
        },
    });

    await server.start();
    app.use(cors());
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server));

    app.listen(8000, () => console.log('🚀 Server at http://localhost:8000/graphql'));
}

startServer();
