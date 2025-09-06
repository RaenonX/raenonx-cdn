# RaenonX CDN Development Guidelines

This document provides guidelines for developing and maintaining this `raenonx-cdn` project.

Note: This document is specifically formatted for JetBrains Junie AI assistant, so some formatting conventions may differ from typical documentation.

## Build/Configuration Instructions

Run `yarn install` to install dependencies.

Do not `yarn run dev` for testing the code. It starts up the development server so it will never terminate.

Run `yarn run build` to build the code.

Run `yarn run clean` to clean up the build directory.

## Testing Information

- Create comprehensive tests to ensure functionality works correctly
- Test edge cases and various input scenarios
- Place tests in appropriate directories matching the structure of the code being tested

## Additional Development Information

### Code Style and Linting

- All code should conform to the ESLint rules defined in the project
- Run the ESLint fix command after making changes to ensure no linting errors:
  ```
  yarn lint:fix
  ```
- Do not use `||` unless both sides are boolean.
- Always prefer `type` over `interface` for type definitions.

### File Organization

For each unit of processing, create a folder where:
- `main.ts` contains the main implementation
- `type.ts` (optional) storing any component-related typings
- `utils.ts` for any short util functions data if needed, which could contain multiple functions,
  but stick to the 200 lines soft-limit. For more complex processing or computationally intensive operations, consider creating either:
    - A `utils` folder with multiple files, each containing related utility functions, or
    - A `calc` folder for files containing calculation-specific logic

Also, each file usually would contain at most 1 function, unless it's `utils.ts`.

`src/app/*` should mimic the actual routes available. For dynamic segment, use brackets with the name inside it instead.

### API Type Definitions

For API request/response typings, create type definitions in `src/types/api` with structure that mirrors the API routes:
- Each API route should have a corresponding directory in `src/types/api`
- Within each route directory, create two files:
  - `request.ts` for request parameter/body types
  - `response.ts` for response object types
- Use named exports only, following the project's export conventions
- Type names should be descriptive and include the route context (e.g., `ImageApiRequest`, `HealthResponse`)

### Constants and Environment Variables

- **Always use environment variables for constants** instead of hardcoded values in the code
- All constants should be defined in the environment configuration (`src/config/env.ts`) and the `.env` file
- This includes but is not limited to:
  - Directory paths
  - Cache control settings
  - Default values for processing (quality, compression levels, etc.)
  - API endpoints and URLs
  - Timeout values
  - Image size constraints (maximum width, height, etc.)
- Use the `env` object from `@/config/env` to access environment variables in your code
- Use helper functions from `envHelpers` for complex environment variable processing
- Never hardcode strings, numbers, or configuration values directly in business logic
- **Exception**: Error messages can be stored in constant objects instead of environment variables for better code organization and maintainability, especially when they are used for validation or API responses. Create a dedicated constants file (e.g., `src/constants/errorMessages.ts`) with a properly typed constant object for storing hard-coded error messages

### Structure and Exports

- Never use `default export` anywhere in the codebase - always use named exports

### Best Practices

- Follow TypeScript best practices and ensure proper typing
- While not a hard-limit, file size usually won't go over 200 lines.
　If so, usually it can be broken into smaller components.
- Document complex logic with comments
- Maintain consistent naming conventions
- When working with objects, use object destructuring if the parent object is not directly used as a whole.
  For example, if an object `{a: 1, b: 2}` stored in variable `c` is accessed separately as `c.a` and `c.b`
  in multiple places, first destructure it with `const {a, b} = c;` and then use the individual variables
  `a` and `b` in subsequent code. This improves readability and reduces repetition.
- Always test for typing issues after completing tasks by running `yarn run tsc`. This is critical to ensure type safety throughout the codebase.
- If there's something you can't complete after multiple attempts (especially typing-related issues), leave a TODO comment around it explaining what should be done.
- Always run `yarn run lint:fix` after task completion to ensure the code satisfies the ESLint rules as much as possible. This command is available in the package.json scripts.
- For const string values, always define both a const string array and a corresponding type derived from it using `typeof arrayName[number]`. This ensures type safety and maintainability. Example:
  ```typescript
  export const validFormats = ['format1', 'format2', 'format3'] as const;
  export type ValidFormat = typeof validFormats[number];
  ```
