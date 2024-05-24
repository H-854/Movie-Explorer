# Movie Search Application

This is a simple Node.js web application built using Express.js that allows users to search for movies using the OMDB API. The application renders movie details on the browser using EJS templating engine.

## Features

- Search for movies by title.
- Display movie details retrieved from the OMDB API.
- Error handling for missing pages and server errors.

## Requirements

- Node.js (version 12 or higher)
- npm (Node Package Manager)

- **views/**: Contains the EJS templates for rendering the HTML pages.
  - `index.ejs`: The main search page.
  - `movie.ejs`: The movie details page.
- **index.js**: Main application file where the Express server is configured.
- **ExpressError.js**: Custom error handling class.
- **wrapAsync.js**: Utility function for wrapping asynchronous route handlers to catch errors.
- **package.json**: Contains the project dependencies and scripts.

## Dependencies

- **express**: Web framework for Node.js.
- **axios**: Promise-based HTTP client for making API requests.
- **ejs**: Embedded JavaScript templating for rendering HTML pages.

## Usage

1. **Homepage**: The homepage (`/`) displays a search form where users can enter a movie title.

2. **Search**: On submitting the search form, the application sends a request to the OMDB API and renders the movie details on a new page.

## Error Handling

- The application has basic error handling implemented. If a user navigates to an undefined route, a 404 error is returned.
- Any unexpected errors during API requests or rendering are caught and a generic error message is displayed.

## Code Overview

### `index.js`

- **Configuration**: Sets up the view engine and the views directory.
  
  ```javascript
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "/views"));
  ```

- **Middleware**: Parses incoming request bodies.
  
  ```javascript
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  ```

- **Routes**:
  - **GET `/`**: Renders the search form.
    
    ```javascript
    app.get("/", (req, res, next) => {
        try {
            res.render("index.ejs");
        } catch (e) {
            next(e);
        }
    });
    ```

  - **GET `/search`**: Fetches movie details from the OMDB API and renders the movie details page.
    
    ```javascript
    app.get('/search', wrapAsync(async (req, res) => {
        let { title } = req.query;
        const response = await axios.get(`https://www.omdbapi.com/?t=${title}&apikey=60c9c38e`);
        let movie = response.data;
        res.render("movie.ejs", { movie });
    }));
    ```

  - **Catch-All Route**: Handles undefined routes and responds with a 404 error.
    
    ```javascript
    app.all("*", (req, res, next) => {
        next(new ExpressError(404, "Page not found"));
    });
    ```

  - **Error Handling Middleware**: Catches and responds to errors.
    
    ```javascript
    app.use((err, req, res, next) => {
        let { status = 500, message = "SOME ERROR" } = err;
        res.status(status).send(message);
    });
    ```

### `ExpressError.js`

Custom error class extending the base `Error` class for consistent error handling.

```javascript
class ExpressError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}

module.exports = ExpressError;
```

### `wrapAsync.js`

Utility function to wrap asynchronous route handlers and catch errors.

```javascript
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}

module.exports = wrapAsync;
```
### Short Explaination of Tech stack used
### Node.js

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side. Node.js is known for its non-blocking, event-driven architecture, which makes it efficient for building scalable network applications.

### Express.js

Express.js is a web application framework for Node.js. It simplifies the process of building web servers and applications by providing a robust set of features such as routing, middleware support, and template engines. Express is minimal and flexible, making it a popular choice for creating web applications and APIs.

### EJS (Embedded JavaScript)

EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. It integrates seamlessly with Express, allowing you to render dynamic HTML pages based on the data provided by the server.

### Axios

Axios is a promise-based HTTP client for JavaScript. It works both in the browser and in Node.js environments. In this application, Axios is used to make HTTP requests to the OMDB API to fetch movie data based on user queries. It simplifies the process of making asynchronous requests and handling responses.

### OMDB API

The OMDB (Open Movie Database) API is a RESTful web service to obtain movie information. It provides a wide range of data including movie titles, year of release, ratings, and more. In this application, the OMDB API is used to search for movies by title and retrieve detailed information to display to the user.

### Middleware

Middleware in Express.js is a function that executes during the lifecycle of a request to the server. Each piece of middleware has access to the request and response objects and can either terminate the request-response cycle or pass control to the next middleware function. This application uses middleware for:
- Parsing JSON and URL-encoded data from incoming requests.
- Handling errors and 404 responses for undefined routes.

### Error Handling

Error handling in Express.js involves defining middleware functions that handle errors. In this application:
- **Custom Error Class (`ExpressError`)**: Extends the built-in `Error` class to include status codes and messages for more consistent error handling.
- **Async Wrapper (`wrapAsync`)**: A utility function to catch errors in asynchronous route handlers, preventing the need for repetitive try-catch blocks.

### File Structure

The application is organized into different files and directories:
- **`index.js`**: The main application file where Express is configured, routes are defined, and middleware is applied.
- **`views/`**: Directory containing EJS templates for rendering HTML pages.
- **`ExpressError.js`**: Defines a custom error class for consistent error handling.
- **`wrapAsync.js`**: Utility function to wrap async route handlers and manage errors.

