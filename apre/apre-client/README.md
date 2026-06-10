# APRE — Agent Performance Reporting Engine

## Project Overview

APRE is a MEAN-stack reporting application. The client is built with Angular 18; the server is an Express/Node.js API backed by MongoDB.

---

## Setup

### Prerequisites

- Node.js ≥ 18
- MongoDB running locally (default port 27017) or a connection string set in the server environment

### Install dependencies

```bash
# Client
cd apre-client
npm install

# Server
cd ../apre-server
npm install
```

---

## Running the application

**Start the API server** (from `apre-server/`):

```bash
npm start          # production
npm run dev        # nodemon watch mode (auto-restarts on changes)
```

The server listens on **http://localhost:3000** by default.

**Start the Angular dev server** (from `apre-client/`):

```bash
npm start          # or: ng serve
```

Navigate to **http://localhost:4200**. The app reloads automatically on source changes.

---

## Running tests

**Server unit tests** (Jest) — from `apre-server/`:

```bash
npm test
```

**Client unit tests** (Karma/Jasmine) — from `apre-client/`:

```bash
ng test
```

---

## Sales by Category feature

This feature adds a bar-chart report showing total sales grouped by salesperson for a user-selected product category.

### New API endpoints

| Method | Path                                      | Description                                              |
| ------ | ----------------------------------------- | -------------------------------------------------------- |
| GET    | `/api/reports/sales/categories`           | Returns a list of distinct product categories            |
| GET    | `/api/reports/sales/categories/:category` | Returns total sales per salesperson for a given category |

### Reproducing the feature

1. Start both the server and the Angular dev server (see above).
2. Sign in at **http://localhost:4200/signin**.
3. In the side menu, expand **Sales Reports** and click **Sales by Category**.
4. Select a category from the dropdown and click **Submit**.
5. A bar chart of total sales by salesperson for that category will render.

### Running the feature tests

```bash
# Server tests (covers both new /categories endpoints)  — from apre-server/
npm test

# Client tests (covers SalesByCategoryComponent)  — from apre-client/
ng test
```

---

## ApreClient (Angular CLI defaults)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
