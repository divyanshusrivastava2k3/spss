# NGO Website Project

This is a modern NGO website built with Next.js (App Router), React, Tailwind CSS, Prisma, and SQLite.

## System Requirements
Before running this project, ensure you have the following installed on your system:
1. **Node.js**: Version 18.17 or higher (Recommended: v20 LTS). Download from [nodejs.org](https://nodejs.org/)
2. **Git** (Optional but recommended for version control)

## Setup Instructions

Follow these step-by-step instructions to run the project locally on your machine:

### 1. Extract the Project
Extract the `.zip` file into a folder of your choice and open that folder in your code editor (like **VS Code**).

### 2. Install Dependencies
Open your terminal (in VS Code: `Ctrl + ~` or `View > Terminal`), make sure you are in the project root folder, and run:
```bash
npm install
```
*(This will download all required libraries and create the `node_modules` folder. It might take a minute or two.)*

### 3. Setup the Database
This project uses SQLite as the local database. To initialize it and create the tables, run:
```bash
npx prisma db push
```

### 4. Create the Admin User & Default Settings (Seed)
To populate the database with the default admin account and website settings, run the seed script:
```bash
npx prisma db seed
```
**Default Admin Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

### 5. Start the Development Server
Finally, start the website locally:
```bash
npm run dev
```

### 6. View the Website
Open your web browser and go to:
- **Website:** [http://localhost:3000](http://localhost:3000)
- **Admin Panel:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---
## Troubleshooting
- **Errors during `npm install`?** Ensure you have the correct Node.js version installed by running `node -v` in the terminal.
- **Red lines in VS Code?** If you see errors in your TypeScript files, they will disappear automatically after `npm install` completes. You may need to restart VS Code if they persist.
