# Mini Job Marketplace

This is a React-based school campus task board web application built with TypeScript and Vite. Students can post small errands or tasks like buying food from the canteen, printing assignments, or getting tutoring help. Other students can apply to complete those tasks for a small fee. An admin can approve, reject, or mark tasks as completed.

## Project Structure and Features

### React Components and Hooks
* Uses `useState` for managing application data (users, jobs, applications) and UI states.
* Uses `useEffect` for loading initial mock data when the application mounts.
* Uses `useRef` to directly focus DOM elements like input fields.
* Custom hooks:
  * `useToggle` - A hook to simplify boolean state toggling.
  * `usePrevious` - A hook to track the previous value of a state variable.

### Defined Interfaces and Types

The following interfaces and types are defined inside `src/types/index.ts`:
* User - A student or admin with a name, email, role, and active status.
* Job - A campus task posted by a student client.
* Application - A student worker applying to complete a task.
* WorkerProfile - An intersection type adding skills and hourly rate to a User.
* ApiResponse - A generic response wrapper for function return values.
* ID - Type alias for numeric IDs.
* Money - Type alias for peso amounts.
* StringOrNumber - Type alias for values that can be either a string or number.

## How to Install and Run

First, install the required dependencies:
```bash
npm install
```

Then, start the Vite development server:
```bash
npm run dev
```