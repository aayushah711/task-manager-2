# Task Manager

A Task Tracking and Management Application backend built with Node.js, Express, PostgreSQL, and Sequelize. This application facilitates collaboration and organization within teams or projects by allowing users to create, assign, and track tasks, as well as collaborate with team members through comments and attachments. The application also includes real-time notifications using WebSockets and an AI-powered task description generator.

## Features

- **User Authentication**: Secure user registration, login, and profile management.
- **Task Management**: Create, update, delete, and manage tasks with features like filtering, sorting, and searching.
- **Team/Project Collaboration**: Users can create or join teams/projects and assign tasks within them.
- **Comments and Attachments**: Collaborate on tasks with comments and file attachments.
- **Real-Time Notifications**: Get notified in real-time when tasks are assigned or updated using WebSockets.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [User Routes](#user-routes)
  - [Task Routes](#task-routes)
  - [Comment Routes](#comment-routes)
  - [Project Routes](#project-routes)
- [Real-Time Notifications](#real-time-notifications)

## Data Model

### Entities

The core entities in the data model are:

1. User: Represents a user in the system. Users can create tasks, be assigned tasks, and participate in projects.

- Attributes: id, name, email, password, profileImage

2. Project: Represents a project or team within the system. A project can have multiple tasks and users.

- Attributes: id, name, description

3. Task: Represents a task within a project. A task can have a title, description, due date, and be assigned to a user.

- Attributes: id, title, description, dueDate, status, createdBy, assignee, projectId

4. Comment: Represents a comment made on a task. A comment can have attachments.

- Attributes: id, content, userId, taskId

5. Attachment: Represents a file attached to a task or comment.

- Attributes: id, fileName, fileType, filePath, taskId, commentId

### Relationships

- User and Project:

  - Many-to-Many: A user can be part of multiple projects, and a project can have multiple users.
  - Implementation: This is managed through a join/junction table (e.g., `UserProjects`).

- Project and Task:

  - One-to-Many: A project can have many tasks, but a task belongs to one project.
  - Implementation: The `projectId` in the `Task` table references the `Project` table.

- User and Task:

  - One-to-Many (Created Tasks): A user can create many tasks.
  - One-to-Many (Assigned Tasks): A user can be assigned to many tasks.
  - Implementation: The `createdBy` and `assignee` columns in the `Task` table reference the `User` table.

- Task and Comment:

  - One-to-Many: A task can have multiple comments.
  - Implementation: The `taskId` column in the `Comment` table references the `Task` table.

- User and Comment:

  - One-to-Many: A User can add multiple comments.
  - Implementation: The `createdBy` column in the `Comment` table references the `User` table.

- Comment and Attachment:

  - One-to-Many: A comment can have multiple attachments.
  - Implementation: The `commentId` column in the `Attachment` table references the `Comment` table.

- Task and Attachment:
  - One-to-Many: A task can have multiple attachments directly.
  - Implementation: The `taskId` column in the `Attachment` table references the `Task` table.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later)
- [PostgreSQL](https://www.postgresql.org/) (v12 or later)
- [Git](https://git-scm.com/)
- Optional: [Docker](https://www.docker.com/) for containerized deployment

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/aayushah711/task-manager-2.git
   cd task-manager-2
   ```

2. Install dependencies:

   ```
   npm install
   ```

### Database Setup

1. Create a PostgreSQL database:

```
createdb task_manager_db
```

2. Update the database configuration in the .env file:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager_db
DB_USER=your_db_username
DB_PASSWORD=your_db_password
```

3. Run migrations to create the necessary tables:

```
npx sequelize-cli db:migrate
```

### Running the Application

1. Start the server:

```
npm start
```

2. The API will be available at http://localhost:3000.

### API Documentation

#### Auth Routes

- POST /auth/register: Register a new user.
- POST /auth/login: Login and obtain an access token.
- POST /auth/logout: Login and obtain an access token.

#### Profile Routes

- GET /profile: View the logged-in user's profile.
- PUT /profile: Update user profile information.

#### Members Routes

- GET /members: View all the user's profiles available on platform.

#### Project Routes

- POST /projects: Create a new project.
- GET /projects/user: Get all projects of a specific user.
- PUT /projects/:id: Update a project.
- DELETE /projects/:id: Delete a project.

#### Task Routes

- GET /tasks: Get all tasks of a specific project with options to filter by status and search by title or description.
- POST /tasks: Create a new task.
- GET /tasks/:id: Get a task by its ID.
- PUT /tasks/:id: Update a task.
- DELETE /tasks/:id: Delete a task.
- GET /tasks/user: Get all tasks of a specific user.

#### Comment Routes

- POST /comments: Add a comment to a task.

### Real-Time Notifications

The application uses WebSockets to provide real-time notifications when a task is assigned to a user.

### WebSocket Implementation

- Socket Events:
  notification\_{userId}: Triggered when a task is assigned to a user or updated.
