# ac_assignment

## Setup Instructions

1. Clone the repository
2. Run `pnpm install` to install the dependencies
3. Run `cp .env.example .env` to create a .env file
4. Run `pnpm dev` to start the development server
5. Visit `http://localhost:3000` to view the application

## Structure

The project is managed using turborepo. The project is divided into two apps: `backend` and `web`. The `backend` app contains the backend code and the `web` app contains the frontend code.

The project has two main packages, the `contract` and the `database`, which are shared between the `backend` and `web` apps. The `contract` package contains the ts-rest common contract shared between the `backend` and `web` apps. The `database` package contains the database schema and the database client.

## Technologies Used

- Next.js
- Prisma
- SQLite
- React Query
- ui.shadcn.com
- turborepo
- pnpm
- TypeScript
- Tailwind CSS
- ts-rest