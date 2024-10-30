# Mongoose TypeScript Converter

[![1.0.0](https://badge.fury.io/js/mongoose-ts-converter.svg)](https://badge.fury.io/js/mongoose-ts-converter)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

Mongoose TypeScript Converter is a lightweight Node.js library designed to simplify Mongoose-to-TypeScript schema conversions. It allows developers to automatically generate TypeScript interfaces from Mongoose schemas, ensuring type safety and saving development time.

## Features

- Converts Mongoose schemas to TypeScript interfaces
- Supports complex data types, including nested objects and arrays
- CLI support for easy integration in projects
- Option to start a documentation server to view generated types
- Middleware support for serving documentation in an existing Express app

## Installation

Install the package via npm:

```bash
npm install mongoose-ts-converter
```

Or with yarn:

```bash
yarn add mongoose-ts-converter
```

## Usage

Programmatic API

```bash
const { convertToTS } = require("mongoose-ts-converter")
const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
})

convertToTS(schema, "User").then((tsInterface) => {
  console.log(tsInterface)
})
```

## CLI Usage

Run the following command to generate TypeScript interfaces from Mongoose models in your project:

```bash
npx mongoose-ts-converter --models ./path/to/models --output ./path/to/output
```

## CLI Options

```bash
-m, --models <dir> - Directory containing your Mongoose model files
-o, --output <dir> - Directory to output the generated TypeScript files
--serve              Start a documentation server after generating schemas
--port <number>      Specify the port for the documentation server (default: 3000)
```

## Example

Given a Mongoose model in the models directory:

```bash
// models/User.js
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
})

module.exports = mongoose.model("User", userSchema)
```

Running the CLI will generate a TypeScript file in the output directory:

```bash
// output/User.d.ts
export interface User {
  username: string
  email: string
}
```

## Starting the Documentation Server

To start a documentation server that serves the generated TypeScript schemas, add the --serve option:

```bash
npx mongoose-ts-converter --models ./path/to/models --output ./path/to/output --serve
```

Specify a custom port for the documentation server (default is 3000):

```bash
npx mongoose-ts-converter --models ./path/to/models --output ./path/to/output --serve --port 4000
```

After running the command, open your browser and go to:

```bash
http://localhost:<specified-port>
```

## Use as Middleware

If you want to serve the documentation for generated TypeScript schemas as part of an existing Express application, you can use the docsRouter middleware:

### Setup

1. First, generate the TypeScript schemas using either the CLI or convertToTS function and specify the output directory.
2. Include docsRouter from mongoose-ts-converter in your Express app, specifying the directory where the generated TypeScript files are stored.

Example

```bash
// app.js
const express = require("express");
const { docsRouter } = require("mongoose-ts-converter");

const app = express();
const PORT = 3000;

// Serve TypeScript documentation
app.use("/api-docs", docsRouter("./path/to/output"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

```

In this setup

- Replace ./path/to/output with the actual path to the directory where TypeScript files are generated.
- Access your documentation at http://localhost:3000/api-docs.

## License

This project is licensed under the MIT License.

## Contact

For issues, questions, or contributions, please reach out to edekobifrank@gmail.com
