# The WallApp ReadMe

## Prerequisites

NODE and MYSQL must be installed and MSQL service must be running

## How to install and start this app?

1. Clone the project from github repository using the command `git clone `
 <a href="https://github.com/mathieubouhelier/wallApp" alt="Recipe-project"> Link to WallApp Repository </a> 
 - Run `git clone git@github.com:mathieubouhelier/wallApp.git`
 
 - Or un `https://github.com/mathieubouhelier/wallApp.git`
 
2. Install the dependencies: 

- Navigate to root directory WallApp/ and run `npm run install`

3. Create an .`env` file at the root (WallApp/) and fill it (use `.env.example` (localize at WallApp/) as an example)
4. Navigate to WallApp/frontend, create an .`env` file and fill it (use `.env_Frontend.example` (localize at WallApp/frontend)as an example)

5. Start the app: 
- Navigate to root directory WallApp/ and run the command `npm start`

## What it is about?

The WallApp alow user to publish, edit and delete a Post. All Posts are displayed on one "wall" where users can see and interact with the Posts.
All posts could be seen by visitors (not logged/Authed users) but only the logged (Authed) users can publish, edit and delete a Post.
It is possible to register new users and when the register process is completed, a welcome email confirmation is send to the new users

## Swagger documentation of WallApp

To access and interact with WallApp Swagger documentation:

- The backend must be running if not navigate to WallApp/backend and run the command `npm run dev` 

- Please access to http://localhost:3000/api-docs/

## WallApp Diagram

<img src = "./Wall App Diagram.png" alt="WallApp Diagram" height="200">
<br />

## How to run the tests?

Two different type of tests are available, units tests for the backend and E2E tests using Cypress.

- To run the units tests:

1. Navigate to WallApp/backend
2. Run the command `npm run dev`
3. Run the command `npm test`

- To run the E2E Cypress tests:

1. Navigate to root WallApp/
2. Run the App using the command `npm start` and after all start and running
3. Navigate WallApp/frontend
4. Run the command `npm cypress:open`

