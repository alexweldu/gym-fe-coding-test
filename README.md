# Byte Kitchen FE coding test (Gym admin)

In this coding test, you will build a web application for managing gym members. This repository contains the API server that the front-end developers will use to fetch and update data. (**Important**: please don't update the ./api project)

## Getting Started

To get started with the API, follow these steps:

1. Clone the repository:

   ```
   git clone https://abel-sintaro@bitbucket.org/mat-sparare/gym-fe-coding-test.git
   ```

2. Change directory to the `api` directory:

   ```
   cd api
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Start the server:

   ```
   npm start
   ```

By default, the server will listen on port 4000. You can change the port by setting the `PORT` environment variable.

## API Endpoints

### Gym Member Authentication

**POST** /login

Logs in a gym member and returns a JWT token to access protected endpoints.

Request Body:

- `orgNumber` (string, required): The organization number of the gym
- `password` (string, required): The password of the gym

Response Body:

- `token` (string): The JWT token for accessing protected endpoints.

Example:

```
POST /login
{
  "orgNumber": "12345678",
  "password": "my-password"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdOdW1iZXIiOiIxMjM0NTY3OCIsImlhdCI6MTYxNTgxNDgxM30.3y3q-V5iVpGZcNLksPjX9YqA02kjEBvMCkMjK8z89aI"
}
```

### Gym Member Endpoints

**GET** /gym

Gets full information about the authenticated gym.

Request Headers:

- `Authorization` (string, required): The JWT token obtained after logging in.

Response Body:

- `id` (number): The ID of the gym.
- `name` (string): The name of the gym.
- `orgNumber` (string): The organization number of the gym.
- `password` (string): The password of the gym.
- `location` (object): The location of the gym.
  - `street` (string): The street address of the gym.
  - `city` (string): The city of the gym.
  - `state` (string): The state of the gym.
  - `zip` (string): The zip code of the gym.

Example:

```
GET /gym

Request Headers:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdOdW1iZXIiOiIxMjM0NTY3OCIsImlhdCI6MTYxNTgxNDgxM30.3y3q-V5iVpGZcNLksPjX9YqA02kjEBvMCkMjK8z89aI"
}

Response:
{
  "id": 1,
  "name": "Gym Name",
  "location": {
    "street": "123 Main St.",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94101"
  },
  "orgNumber": "12345678",
  "password": "my-password"
}
```

### **GET** /members

Gets a list of all members of the authenticated gym.

Request Headers:

- `Authorization` (string, required): The JWT token obtained after logging in.

Example:

Request:

```
GET /members/2 HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdOdW1iZXIiOiIxMjM0NSIsImlhdCI6MTYxNjI0MDA1MCwiZXhwIjoxNjE2MjQzNjUwfQ.-8r7WJb1pgRZDYsdQZJ2t8Hw_jDvJg-k1YtJF3pMfc8
```

Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

[
    {
      "id": 1,
      "name": "Bob",
      "email": "bob@example.com",
      "startedOn": 1829132233508,
      "address": {
        "street": "123 Main St",
        "city": "Vegen",
        "state": "LA",
        "zip": "12345"
      },
      "gymId": 1
    },
    {
      "id": 2,
      "name": "Alice",
      "email": "alice@example.com",
      "startedOn": 1616132233508,
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zip": "23412"
      },
      "gymId": 1
    }
]
```

### **GET** /members/:id

Gets a list of all members of the authenticated gym.

Request Headers:

- `Authorization` (string, required): The JWT token obtained after logging in.

Response Body:

- `id` (number): The ID of the member.
- `gymId` (number): The ID of the gym the member belongs to.
- `name` (string): The name of the member.
- `email` (string): The email address of the member.
- `startedOn` (number): The timestamp of when the member started.
- `address` (object): The address of the member.
  - `street` (string): The street address of the member.
  - `city` (string): The city of the member.
  - `state` (string): The state of the member.
  - `zip` (string): The zip code of the member.

Example:

Request:

```
GET /members/2 HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdOdW1iZXIiOiIxMjM0NSIsImlhdCI6MTYxNjI0MDA1MCwiZXhwIjoxNjE2MjQzNjUwfQ.-8r7WJb1pgRZDYsdQZJ2t8Hw_jDvJg-k1YtJF3pMfc8
```

Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 2,
  "name": "Alice",
  "email": "alice@example.com",
  "startedOn": 1616132233508,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  },
  "gymId": 1
}
```

### POST /members

Create a new member for the authenticated gym.

Request Headers:

- `Authorization` (string, required): The JWT token obtained after logging in.

Request Body:

- `name` (string): The name of the member.
- `email` (string): The email address of the member.
- `address` (object): The address of the member.
  - `street` (string): The street address of the member.
  - `city` (string): The city of the member.
  - `state` (string): The state of the member.
  - `zip` (string): The zip code of the member.

Request Body:

- `id` (number): The ID of the member.
- `gymId` (number): The ID of the gym the member belongs to.
- `name` (string): The name of the member.
- `email` (string): The email address of the member.
- `startedOn` (number): The timestamp of when the member started.
- `address` (object): The address of the member.
  - `street` (string): The street address of the member.
  - `city` (string): The city of the member.
  - `state` (string): The state of the member.
  - `zip` (string): The zip code of the member.

Example:

Request:

```
POST /members HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdOdW1iZXIiOiIxMjM0NSIsImlhdCI6MTYxNjI0MDA1MCwiZXhwIjoxNjE2MjQzNjUwfQ.-8r7WJb1pgRZDYsdQZJ2t8Hw_jDvJg-k1YtJF3pMfc8

{
  "name": "Alice",
  "email": "alice@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  }
}
```

Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 2,
  "name": "Alice",
  "email": "alice@example.com",
  "startedOn": 1616132233508,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  },
  "gymId": 1
}
```

### PUT /members/:id

Update a member of the authenticated gym.

Request Headers:

- `Authorization` (string, required): The JWT token obtained after logging in.

Request Body:

- `name` (string): The name of the member.
- `email` (string): The email address of the member.
- `address` (object): The address of the member.
  - `street` (string): The street address of the member.
  - `city` (string): The city of the member.
  - `state` (string): The state of the member.
  - `zip` (string): The zip code of the member.

Request Body:

- `id` (number): The ID of the member.
- `gymId` (number): The ID of the gym the member belongs to.
- `name` (string): The name of the member.
- `email` (string): The email address of the member.
- `startedOn` (number): The timestamp of when the member started.
- `address` (object): The address of the member.
  - `street` (string): The street address of the member.
  - `city` (string): The city of the member.
  - `state` (string): The state of the member.
  - `zip` (string): The zip code of the member.

Example:

Request:

```
PUT /members/2 HTTP/1.1
Host: localhost:4000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdOdW1iZXIiOiIxMjM0NSIsImlhdCI6MTYxNjI0MDA1MCwiZXhwIjoxNjE2MjQzNjUwfQ.-8r7WJb1pgRZDYsdQZJ2t8Hw_jDvJg-k1YtJF3pMfc8

{
  "name": "Alice",
  "email": "alice@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  }
}
```

Response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 2,
  "name": "Alice",
  "email": "alice@example.com",
  "startedOn": 1616132233508,
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345"
  },
  "gymId": 1
}
```

### DELETE /members/:id

Deletes a specific member of the authenticated gym by ID.

Request:

- `:id` - The ID of the member to delete.

Response:

- `204 No Content` - If the member was deleted successfully.
- `401 Unauthorized` - If the request does not include a valid JWT token.
- `404 Not Found` - If the member with the specified ID was not found in the authenticated gym.

Example:

Request:

```
DELETE /members/2 HTTP/1.1
Host: localhost:4000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdOdW1iZXIiOiIxMjM0NSIsImlhdCI6MTYxNjI0MDA1MCwiZXhwIjoxNjE2MjQzNjUwfQ.-8r7WJb1pgRZDYsdQZJ2t8Hw_jDvJg-k1YtJF3pMfc8
```

Response:

```
HTTP/1.1 204 No Content
```

# The task

## Front-End Development (Admin page)

The front-end developers should use the Nextjs application inside the `app`. They should then use MUI-5 for the UI components and SWR for communicating with the API data. The front-end should allow users to:

- Log in to a gym and get a JWT token
- See detail information about the authenticated gym
- Create a new member for the authenticated gym
- Update a member for the authenticated gym
- Display list of members (name and email) of the authenticated gym (List page)
- Display specific member full information of the authenticated gym (Detailed page)
- Handle errors from the API and present them gracefully
- There is not specific requirement for the UI but please make it pleasant for the eye 🤩

## Good luck! 💫
