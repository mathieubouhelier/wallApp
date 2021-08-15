# The WallApp ReadMe

## Prerequisites

NODE and MYSQL must be installed and running

## How to install and start this app?

1. Clone the project from github repository using the command `git clone `
 <a href="https://github.com/mathieubouhelier/wallApp" alt="Recipe-project"> Link to WallApp Repository </a> 
 - Run `git clone git@github.com:mathieubouhelier/wallApp.git`
 
 - Or un `https://github.com/mathieubouhelier/wallApp.git`
 
2. Install the dependencies: 

- Navigate to root directory and run `npm run install`

3. Create an .`env` file at the root and fill it (use `.env.example` as an example)
4. Navigate to /frontend, create an .`env` file and fill it (use `.env.example` as an example)

5. Start the app: 
- Navigate to root directory and run `npm start`

## What it is about?

The WallApp alow user to publish, edit and delete a Post. All Posts are displayed on one "wall" where users can see and interact with the Posts.
All posts could be seen by visitors (not logged/Authed users) but only the logged (Authed) users can publish, edit and delete a Post.
It is possible to register new users and when the register process is completed, a welcome email confirmation is send to the new users

## Swagger documentation of WallApp

To access and interact with WallApp Swagger documentation:

- The backend must be running.  Run `npm run dev` form backend directory

- Please access to http://localhost:3000/api-docs/

## How to run the tests?

Two different type of tests are available, units tests for the backend and E2E tests using Cypress.

- To run the units tests:

1. Navigate into the backend directory
2. Execute `npm run dev`
3. Execute `npm test`

- To run the E2E Cypress tests:

1. Navigate into the frontend directory
2. Execute `npm cypress:open`

