# TODO_CRUD

In order to start locally the app is to run npm install on the machine.
In the package.json are the packages that I have used in order to work the application properly

This Application contains 4 folders and 1 file that are crutial for her:

- config(folder)
- middleware(folder)
- models(folder)
- routes/api(floders)
-server.js (file)

- Server.js
This file is used in order to connect the app with express, define the routes, connect to db, initialize middleware. There is a comment above every action that is been taken.


- config
Here we have set the db configuration file in order to connect with the database (in our case MongoDb). Here also we have a comment

- middleware
Here we initialize our middleware in order to check if the user is correctly validated. There are comments above every action that is been taken.

- Models
We define our User model and Activity as a part of it.

-routes/api

Here we have two files:
auth.js we have defined two routes: 
 -api/auth which is for getting the user, a kind of test route
 -api/auth which is for login the user.
 The routes are used implemented get and post methods in order to provide the action that we want
 user.js provides us: Register User, Delete Activity, Get Single Activity for a user, Get Activities for a user, Post activity(add), Update single Activity.
 
 
