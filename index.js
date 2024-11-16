const { ApolloServer, gql } = require("apollo-server");

let tasks = [
  {
    id: "1",
    title: "Learn GraphQL",
    description: "Study the basics of GraphQL",
    completed: false,
    priority: "high",
  },
  {
    id: "2",
    title: "Build Backend",
    description: "Create a Node.js backend with GraphQL",
    completed: false,
    priority: "medium",
  },
];

const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    priority: String!
  }

  type Query {
    getTasks: [Task]
    getTaskById(id: ID!): Task
  }

  type Mutation {
    addTask(title: String!, priority: String!, description: String): Task
    toggleTaskCompletion(id: ID!): Task
  }
`;

const resolvers = {
  Query: {
    getTasks: () => tasks,

    getTaskById: (_, { id }) => {
      const task = tasks.find((task) => task.id === id);
      if (!task) throw new Error("Task not found");
      return task;
    },
  },

  Mutation: {
    addTask: (_, { title, priority, description }) => {
      const validPriorities = ["low", "medium", "high"];

      if (!validPriorities.includes(priority)) {
        throw new Error("Invalid priority value");
      }

      const newTask = {
        id: String(tasks.length + 1),
        title,
        description: description || null,
        completed: false,
        priority,
      };

      console.log(newTask);

      tasks.push(newTask);
      return newTask;
    },

    toggleTaskCompletion: (_, { id }) => {
      const task = tasks.find((task) => task.id === id);
      if (!task) throw new Error("Task not found");
      task.completed = !task.completed;
      return task;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
