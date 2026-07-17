Mini Job Marketplace

This is a console-based school campus task board built in TypeScript. Students can post small errands or tasks like buying food from the canteen, printing assignments, or getting tutoring help. Other students can apply to complete those tasks for a small fee. An admin can approve, reject, or mark tasks as completed.

Defined Interfaces and Types

The following interfaces and types are defined inside types/index.ts:
* User - A student or admin with a name, email, role, and active status.
* Job - A campus task posted by a student client.
* Application - A student worker applying to complete a task.
* WorkerProfile - An intersection type adding skills and hourly rate to a User.
* ApiResponse - A generic response wrapper for function return values.
* ID - Type alias for numeric IDs.
* Money - Type alias for peso amounts.
* StringOrNumber - Type alias for values that can be either a string or number.

How to Install and Run

npm install

npx tsx src/index.ts