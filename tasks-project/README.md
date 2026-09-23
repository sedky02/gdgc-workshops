# Tasks API Workshop

A simple Tasks CRUD app: Express + Mongoose API, MongoDB, and a React client.

## Stack

- **API**: Node.js, Express, Mongoose
- **Database**: MongoDB (run via Docker)
- **Client**: React (Vite)

## Prerequisites

- Node.js (v18+)
- Docker (with Docker Compose)

## 1. Install dependencies

From the project root, install the API dependencies:

```bash
npm install
```

Then install the client dependencies:

```bash
cd client
npm install
cd ..
```

## 2. Configure environment variables

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

`.env` contains:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27018/tasks-api
```

## 3. Start MongoDB

MongoDB and Mongo Express (a web UI for browsing the database) run in Docker:

```bash
npm run mongo:up
```

This starts:

- MongoDB on `localhost:27018`
- Mongo Express on [http://localhost:8082](http://localhost:8082)

To stop them (data persists in a Docker volume):

```bash
npm run mongo:down
```

## 4. Run the API

```bash
npm run dev
```

The API starts on [http://localhost:3000](http://localhost:3000).

### Endpoints

| Method | Route        | Description       |
|--------|--------------|--------------------|
| GET    | `/tasks`     | List all tasks     |
| POST   | `/tasks`     | Create a task      |
| GET    | `/tasks/:id` | Get a single task  |
| PUT    | `/tasks/:id` | Update a task      |
| DELETE | `/tasks/:id` | Delete a task      |

## 5. Run the client

In a separate terminal:

```bash
cd client
npm run dev
```

The client starts on [http://localhost:5173](http://localhost:5173) and talks to the API at `http://localhost:3000`.

## Viewing the database

- **Mongo Express (web UI)**: [http://localhost:8082](http://localhost:8082)
- **Mongo shell**:
  ```bash
  docker exec -it tasks-mongo mongosh tasks-api
  ```
- **MongoDB Compass (GUI app)**: connect to `mongodb://127.0.0.1:27018/tasks-api`
