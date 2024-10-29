# Mongoose TypeScript Converter

[![1.0.0](https://badge.fury.io/js/mongoose-ts-converter.svg)](https://badge.fury.io/js/mongoose-ts-converter)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

Mongoose TypeScript Converter is a lightweight Node.js library designed to simplify Mongoose-to-TypeScript schema conversions. It allows developers to automatically generate TypeScript interfaces from Mongoose schemas, ensuring type safety and saving development time.

## Features

- Converts Mongoose schemas to TypeScript interfaces
- Supports complex data types, including nested objects and arrays
- CLI support for easy integration in projects

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

## License

This project is licensed under the MIT License.

## Contact

For issues, questions, or contributions, please reach out to edekobifrank@gmail.com
