# ticketingms
A project demonstrating microservices using Express for Web APIs and Server-Side Rendering with React for the client application.

The app is a simple ticketing e-commerce-like application. It displays a listing of tickets in which users can place an order on. Placing an order will lock the ticket  in an ordering session where it will temporarily be delisted and other users can not place an order on it. After the order is complete, on purchase the ticket will remain unlisted or if the ordering session expires after a set duration before the orderee could finish payment, the ticket is released from the lock and returns listed open to ordering again.

User Authentication is required for many of the apps features: Listing, Updating, Deleting, and placing Orders and making Payments. Users can only update and delete tickets they have listed and are not yet sold. The app implements simplistic user authentication and session management through JWTs in cookie sessions.

Data synchronization across microservices is achieved through an event bus using NATS Streaming. We implement the serivce choreography pattern where services will emit events which are sent to a named queue in which other relevant services can listen to for data updates.

## Languages
* Javascript / [Typescript](https://www.typescriptlang.org/)

## Frameworks & Libraries
* [Express](https://expressjs.com/)
* [cookie-session middleware for Express to sessions in cookies](https://github.com/expressjs/cookie-session)
* [express-validator middleware for validating and sanitizing inputs](https://express-validator.github.io/docs/)
* [jsonwebtoken library for dealing with JWTs](https://github.com/auth0/node-jsonwebtoken)
* [node-nats-streaming for distributed systems](https://github.com/nats-io/stan.js)
* [Bull for Redis-based Queues](https://optimalbits.github.io/bull/)
* [Next for Server-Side Rendering with React](https://nextjs.org/)
* [Bootstrap CSS library](https://getbootstrap.com/)
* [Axios for HTTP client](https://axios-http.com/)
* [Mongoose for MongoDB Object Data Modeling](https://mongoosejs.com/)
* [Jest for unit testing](https://jestjs.io/)
* [SuperTest for HTTP assertions in unit tests](https://github.com/ladjs/supertest)
* [mongodb-memory-server to mock MongoDB in unit tests](https://github.com/nodkz/mongodb-memory-server)

## Other Technologies
* [Docker](https://www.docker.com/)
* [Kubernetes for automating deployments](https://kubernetes.io/)
* [Skaffold for simplifying Kubernetes deployments in development](https://skaffold.dev/)
