# AMS Backend

This is the backend for the Asset Management System (AMS) built using Express.js. Follow the steps below to set up and run the backend on your local machine.

## Table of Contents
- [Prerequisites](#prerequisites)
  - [Verify Installation](#verify-installation)
- [Setup](#setup)
  - [Install Dependencies](#install-dependencies)
  - [Create Environment Configuration](#create-environment-configuration)
  - [Configure CORS (if needed)](#configure-cors-if-needed)
  - [Sync Database](#sync-database)
  - [Running the Application](#running-the-application)
- [Packages Used in This Project](#package-used-in-this-project)
- [Additional Information](#additional-information)

## Prerequisites

Before you begin, make sure you have Node.js and npm installed on your system. You can download **Node.js** from [nodejs.org](https://nodejs.org/).

### Verify Installation

To verify that Node.js is installed, run:
```
node -v
```


To verify that npm is installed, run:
```
npm -v
```

We recommend installing npm globally so it can be used anywhere within the system:
```
npm install npm -g
```

## Setup

### Install Dependencies

In the project directory, run:
```
npm install
```

### Create Environment Configuration

Create a new file called .env in the root of the project manually or by running this on terminal:
```
touch .env
```

Add the following configuration to the .env file:
```
# Application port
APP_PORT=your_desired_port, example(5000)

# JWT secret keys
ACCESS_TOKEN_SECRET=put_random_string, example (7809379b055d7920bb6f5133f6dc1207f4556fc648)

# Database configuration
DB_NAME=your_DB_name
DB_USERNAME=your_DB_username
DB_PASSWORD=your_DB_password
DB_HOST=localhost 
DB_DIALECT=MSSQL
DB_TIMEZONE=GMT+7
```
> `note` : if you use another dialect check what compability it has in [here](https://sequelize.org/releases/), every dialect using different package so make sure to check that out


### Configure CORS (if needed)

If you encounter any issues with CORS, open **index.js** and add your frontend URL to the CORS configuration:

```
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "your_frontend_url"]
  })
);
```

### Sync Database 
Sync Database with Models
You can sync the database with existing models so you don't have to create tables manually. To do this, open **index.js** and remove the comment from the following lines:
```
(async () => {
  await db.sync();
})();
```


### Running the Application
To start the application, run:
```
npm run start
```
This will start the server on the port specified in your .env file. And nodemon will be automatically restarting the node application when file changes in the directory are detected.

## Package Used in This Project
- [@feathersjs/express](https://www.npmjs.com/package/@feathersjs/express) : Feathers Express framework bindings and REST provider.
- [@feathersjs/socketio](https://www.npmjs.com/package/@feathersjs/socketio) :  The Feathers Socket.io real-time API provider.
- [argon2](https://www.npmjs.com/package/argon2) : A password hashing library.
- [cors](https://www.npmjs.com/package/cors) : Middleware to enable Cross-Origin Resource Sharing.
- [dotenv](https://www.npmjs.com/package/dotenv) : Loads environment variables from a .env file into process.env.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) : JSON Web Token implementation for token-based authentication.
- [nodemon](https://www.npmjs.com/package/nodemon) : Utility that automatically restarts the node application when file changes in the directory are detected.
- [sequelize](https://www.npmjs.com/package/sequelize) : Promise-based Node.js ORM for various SQL databases.
- [tedious](https://www.npmjs.com/package/tedious) : A TDS protocol implementation for connecting to Microsoft SQL Server.

## Additional Information
Development : We recommend using [VSCode](https://code.visualstudio.com/) for development.

Database : Make sure your database is set up and running. Update the .env file with your database credentials.

Feel free to modify the content according to your needs and add any additional sections or instructions if necessary.
