# Social Media Content Calendar

A modern web application for planning and scheduling social media content across multiple platforms.

## Technologies Used

- React with TypeScript
- Vite for frontend development
- Tailwind CSS for styling
- React Query for data management
- PostgreSQL or SQLite for data storage
- Express.js backend API

## Quick Start

1. Clone the repository:
   ```
   git clone https://github.com/RodrigoMvs123/Social-Media-Content-Calendar-V1.git
   cd Social-Media-Content-Calendar-V1
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your credentials and preferred database option.

4. Start the application:
   ```
   npm run dev
   ```

   This will start both the frontend (http://localhost:3000) and backend (http://localhost:3001) servers.

5. Open your browser to http://localhost:3000

## Database Configuration

This application supports two database options:

1. **PostgreSQL** (Recommended for production):
   - Set in `.env`: `DB_TYPE=postgres` and `DATABASE_URL=your_postgres_connection_string`
   - Requires PostgreSQL server (local or cloud-based like Render.com)
   - Supports SSL connections for cloud databases

2. **SQLite** (Great for development):
   - Set in `.env`: `DB_TYPE=sqlite` and optionally `DB_PATH=./your_database.sqlite`
   - No additional setup required
   - Data stored in a local file

The application will automatically use the database specified in your environment variables.

## Social Media Integration

This application supports two modes for social media integration:

### Demo Mode
- Simulates connections without real authentication
- Enter any username/password to connect
- Perfect for testing and development
- No developer accounts or API credentials required

### OAuth Mode (For Real Integration)
To use real social media integration:

1. Register as a developer on each platform:
   - Twitter: [Twitter Developer Portal](https://developer.twitter.com/)
   - LinkedIn: [LinkedIn Developer Portal](https://developer.linkedin.com/)
   - Facebook/Instagram: [Meta for Developers](https://developers.facebook.com/)

2. Create an application in their developer portals

3. Configure the redirect URLs to point to your application:
   - Example: `http://localhost:3001/oauth/callback/twitter`

4. Copy the client ID and secret to your `.env` file

5. Set `OAUTH_REDIRECT_URI` in your `.env` file

The application is already configured to use these credentials when available.

## Features

- **Calendar Views**: Month, List, and Grid views for visualizing your content schedule
- **Post Management**: Create, edit, and delete posts across multiple platforms
- **AI Content Generation**: Generate content ideas and full posts with AI assistance
- **Multi-Platform Support**: Schedule posts for Twitter, LinkedIn, Facebook, and Instagram
- **Filtering & Search**: Filter posts by platform, status, and search by content
- **Persistent Storage**: Store your data in PostgreSQL or SQLite database

## Usage

- **Create Posts**: Click the "Add New Post" button to create a new post
- **Generate AI Content**: Click "Generate AI Content" to use AI for content creation
- **Edit/Delete Posts**: Use the edit (pen) and delete (trash) icons on each post
- **Change Views**: Toggle between Month, List, and Grid views using the view selector
- **Filter Content**: Use the filter bar to find specific posts
- **Connect Accounts**: Use the Connect page to link your social media accounts

## Development

For development purposes, you can use either database option:

- **SQLite**: Simpler setup, great for local development
- **PostgreSQL**: More similar to production environment

The application includes mock data for initial testing. To modify the mock data, edit:
```
client/src/lib/mockApi.ts
```