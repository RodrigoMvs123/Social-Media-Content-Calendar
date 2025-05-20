# Social Media Content Calendar

A modern web application for planning and scheduling social media content across multiple platforms.

## Technologies Used

- React with TypeScript
- Vite for frontend development
- Tailwind CSS for styling
- React Query for data management
- Mock API for simulating backend functionality

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

3. Start the application:
   ```
   npm run dev:frontend
   ```

4. Open your browser to http://localhost:5173

## Features

- **Calendar Views**: Month, List, and Grid views for visualizing your content schedule
- **Post Management**: Create, edit, and delete posts across multiple platforms
- **AI Content Generation**: Generate content ideas and full posts with AI assistance
- **Multi-Platform Support**: Schedule posts for Twitter, LinkedIn, Facebook, and Instagram
- **Filtering & Search**: Filter posts by platform, status, and search by content

## Usage

- **Create Posts**: Click the "Add New Post" button to create a new post
- **Generate AI Content**: Click "Generate AI Content" to use AI for content creation
- **Edit/Delete Posts**: Use the edit (pen) and delete (trash) icons on each post
- **Change Views**: Toggle between Month, List, and Grid views using the view selector
- **Filter Content**: Use the filter bar to find specific posts

## Development

This application uses mock data for development and demonstration purposes. All data is stored in memory and will be reset when the page is refreshed.

To modify the mock data, edit the following file:
```
client/src/lib/mockApi.ts
```

