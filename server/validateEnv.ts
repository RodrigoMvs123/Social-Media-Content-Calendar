// server/validateEnv.ts
export function validateEnv() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'SLACK_BOT_TOKEN',
    'SLACK_SIGNING_SECRET',
    'JWT_SECRET',
    'CORS_ORIGINS'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );
  
  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingEnvVars.forEach((envVar) => {
      console.error(`   - ${envVar}`);
    });
    console.error('Please check your .env file or environment settings.');
    
    // Optional: exit the process in development, but may want to continue in production
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
  } else {
    console.log('✅ All required environment variables are set');
  }
}

// Then import and call this function in your index.ts after dotenv.config()