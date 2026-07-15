# Modern Full-Stack Portal

A modern, animation-rich website with an Admin Panel and a User-facing interface.

## Tech Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Animations:** Framer Motion
- **Backend:** Next.js API Routes
- **Database:** SQLite with Prisma ORM
- **Auth:** JWT, bcrypt, and PIN-based Admin Access

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key"
   ADMIN_PIN="2424"
   ```

3. **Database Migration:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

## Admin Access
- Navigate to `/admin/login`
- Use the PIN: `2424`

## User Access
- Users are created by the Admin in the Admin Panel.
- The Admin will provide a login (`firstname.lastname`) and a temporary password.
- Navigate to `/login` to sign in as a user.

## Deployment to the Internet

### Option A: Vercel (Fastest)
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Add your environment variables in the Vercel dashboard:
   - `JWT_SECRET`: A random long string.
   - `ADMIN_PIN`: `2424` (or your choice).
3. Vercel will automatically run the build using `vercel.json`.
*Note: SQLite data will reset on every deploy on Vercel. For persistent data, use Turso or Railway.*

### Option B: Railway / DigitalOcean (Persistent SQLite)
1. Use the provided `Dockerfile`.
2. Set up a "Volume" to persist the `prisma/dev.db` file.
3. Deploy the container.

## Desktop Application (.exe)

I have integrated **Electron** into this project so you can turn it into a Windows Desktop App.

### 1. Requirements
You must have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Run as a Desktop App (Development)
```bash
npm run electron-dev
```

### 3. Create a Standalone .exe (Production)
Run this command on your Windows computer:
```bash
npm run package
```
This will:
- Build the Next.js production files.
- Package everything into a single `.exe` installer.
- The output will be in the `/dist` folder.

---

## Connecting an AI Assistant (Optional)
If by "connect you" you meant adding an AI agent like myself into the website, you can add an `OPENAI_API_KEY` to your `.env` and I can create a `/api/chat` route and a floating chat bubble component for you. Just let me know!
