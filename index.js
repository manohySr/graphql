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

const validPriorities = ["low", "medium", "high"];

const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    priority: String!
  }

  type Query {
    getTasks(priority: String, completed: Boolean): [Task]
    getTaskById(id: ID!): Task
  }

  type Mutation {
    addTask(title: String!, priority: String!, description: String): Task
    toggleTaskCompletion(id: ID!): Task
    updateTask(
      id: ID!
      title: String
      priority: String
      completed: Boolean
      description: String
    ): Task
    deleteTask(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    getTasks: (priority, completed) => tasks,

    getTaskById: (_, { id }) => {
      const task = tasks.find((task) => task.id === id);
      if (!task) throw new Error("Task not found");
      return task;
    },
  },

  Mutation: {
    addTask: (_, { title, priority, description }) => {
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

    updateTask: (_, { id, title, priority, completed, description }) => {
      const task = tasks.find((task) => task.id === id);
      if (!task) throw new Error("Task not found");

      // Validate the priority if it's being updated
      if (priority) {
        if (!validPriorities.includes(priority)) {
          throw new Error(
            `Invalid priority value. Allowed values are: ${validPriorities.join(", ")}`,
          );
        }
      }

      // Update fields only if they are provided
      if (title !== undefined) task.title = title;
      if (priority !== undefined) task.priority = priority;
      if (completed !== undefined) task.completed = completed;
      if (description !== undefined) task.description = description;

      return task;
    },

    deleteTask: (_, { id }) => {
      const taskIndex = tasks.findIndex((task) => task.id === id);
      if (taskIndex === -1) throw new Error("Task not found");

      tasks.splice(taskIndex, 1);
      return `Task with ID ${id} deleted successfully`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
