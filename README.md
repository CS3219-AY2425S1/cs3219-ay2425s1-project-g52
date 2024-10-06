[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)
# CS3219 Project (PeerPrep) - AY2425S1
## Group: G52

### Note: 
- You can choose to develop individual microservices within separate folders within this repository **OR** use individual repositories (all public) for each microservice. 
- In the latter scenario, you should enable sub-modules on this GitHub classroom repository to manage the development/deployment **AND** add your mentor to the individual repositories as a collaborator. 
- The teaching team should be given access to the repositories as we may require viewing the history of the repository in case of any disputes or disagreements. 

# Local Setup Guide

This guide describes how to set up the Peerprep's frontend and backend locally.

## Clone the Repository

In a command line, navigate to the destination folder and clone the repository from GitHub to your local machine:

```bash
git clone https://github.com/CS3219-AY2425S1/cs3219-ay2425s1-project-g52.git
```

then change directory into

```bash
cd cs3219-ay2425s1-project-g52
```

## Installing dependencies and running the application
(FOR MILESTONE 3)
There is containerization in this milestone with Docker, and there is a `docker-compose.yml` file to facilitate dependency installations and running of app.

Please obtain the frontend and backend `.env` files from a developer and drop it into these directories:
- `frontend` 
- `backend\user-service`
- `backend\question-service` 

After placing the `.env` files, go to the root directory at `cs3219-ay2425s1-project-g52`. 

Build the docker files contained in this project by using the command:
```bash
docker-compose build --no-cache
```
OR (For Mac users, you may need to remove the hypen):
```bash
docker compose build --no-cache
```

Spin up the docker-compose for the project with the command:
```bash
docker-compose up
```

OR (For Mac users, you may need to remove the hypen):
```bash 
docker compose up
```

You should see three services being launched by Docker. The following are observable success messages recorded by docker:

For frontend:
On successful launch, you should see the message in docker: 
```
frontend-1          | You can now view question-service in the browser.
frontend-1          |
frontend-1          |   Local:            http://localhost:3000
frontend-1          |   On Your Network:  http://172.18.0.3:3000
```

For Backend User Service:
On successful launch, you should see the message:
```
user-service-1      | MongoDB Connected!
user-service-1      | User service server listening on http://localhost:3001
```

For Backend question-service:
On successful launch, you should see the message:
```
question-service-1  | Listening on localhost:8000
question-service-1  | Database connected..
```


## Conclusion

You are now set up locally and can explore the app. You can check out our [developer guide](DeveloperGuide.md) to learn more. 

Further enhancement to be made in future updates.