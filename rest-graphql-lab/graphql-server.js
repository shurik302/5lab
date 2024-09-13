const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

let tasks = [
    { id: 1, name: 'Task 1' },
    { id: 2, name: 'Task 2' },
];

// Define the schema
const schema = buildSchema(`
    type Task {
        id: Int
        name: String
    }
    type Query {
        tasks: [Task]
        task(id: Int!): Task
    }
    type Mutation {
        createTask(name: String!): Task
        updateTask(id: Int!, name: String!): Task
        deleteTask(id: Int!): String
    }
`);

// Define the root resolver
const root = {
    tasks: () => tasks,
    task: ({ id }) => tasks.find(task => task.id === id),
    createTask: ({ name }) => {
        const task = { id: tasks.length + 1, name };
        tasks.push(task);
        return task;
    },
    updateTask: ({ id, name }) => {
        const task = tasks.find(task => task.id === id);
        if (!task) throw new Error('Task not found');
        task.name = name;
        return task;
    },
    deleteTask: ({ id }) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) throw new Error('Task not found');
        tasks.splice(taskIndex, 1);
        return 'Task deleted successfully';
    }
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`GraphQL server running on port ${PORT}`));
