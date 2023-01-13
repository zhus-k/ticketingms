
# Ticketing Microservices

A project demonstrating microservices using Express for Web APIs and Server-Side Rendering with React for the client application.

The app is a simple ticketing e-commerce-like application. It displays a listing of tickets in which users can place an order on. Placing an order will lock the ticket  in an ordering session where it will temporarily be delisted and other users can not place an order on it. After the order is complete, on purchase the ticket will remain unlisted or if the ordering session expires after a set duration before the orderee could finish payment, the ticket is released from the lock and returns listed open to ordering again.

User Authentication is required for many of the apps features: Listing, Updating, Deleting, and placing Orders and making Payments. Users can only update and delete tickets they have listed and are not yet sold. The app implements simplistic user authentication and session management through JWTs in cookie sessions.

Data synchronization across microservices is achieved through an event bus using NATS Streaming. We implement the service choreography pattern where services will emit events which are sent to a named queue in which other relevant services can listen to for data updates.

## Run in development

### Prerequisites

Requires Docker Hub and Kubernetes installed.

#### Create Kubernetes Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
```

#### Fiddling with host files

The app uses a hostname because using localhost seems more appropriate. By default it uses ticketingms.dev however you can change it to whatever you want.

To do so firstly, open infra\k8s-dev\ingress-srv.yaml, and change the host to what you want.

In Windows, open "C:\Windows\System32\drivers\etc\hosts" and insert at the bottom:

```text
127.0.0.1 <your hostname>
```

In Unix based OS, you open "\etc\hosts".

This will resolve \<your hostname\> to 127.0.0.1 (localhost) thereby allowing you to access localhost with \<your hostname\> instead of just plain localhost.

#### Secrets

The app requires two secrets:

The JWT secret can be any string of characters. The Stripe secret is obtained by creating a Stripe account.

To create required secrets in Kubernetes:

```bash
kubectl create secret generic jwt-secret --from-literal=JWT_SECRET<your JWT secret>
kubectl create secret generic stripe-secret --from-literal=STRIPE_SECRET=<your Stripe secret>
```

### Deployment

Then to run the backend in the Kubernetes cluster, go to the project root folder and run:

```bash
skaffold dev -p api
```

With Skaffold your apps in your Kubernetes cluster will automatically rebuild and redeploy on save.

To run the frontend, first run the backend in the Kubernetes cluster, then navigate to /web directory and run:

```bash
npm run app:development
```

This is so you retain the advantage of developing the frontend independently of your cluster because rebuilding the frontend app is quite a bit slower in a cluster than in local development.

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

* GitHub workflows
* [Docker](https://www.docker.com/)
* [Kubernetes for automating deployments](https://kubernetes.io/)
* [Skaffold for simplifying Kubernetes deployments in development](https://skaffold.dev/)
