// Validate required environment variables
export function validateEnv() {
  const requiredVars = [
    'SESSION_SECRET',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Using default values for development. DO NOT use in production!');
  }
  
  // Check OAuth credentials
  const oauthPlatforms = ['LINKEDIN', 'TWITTER', 'FACEBOOK', 'INSTAGRAM'];
  const missingOAuth = oauthPlatforms.filter(platform => 
    !process.env[`${platform}_CLIENT_ID`] || !process.env[`${platform}_CLIENT_SECRET`]
  );
  
  if (missingOAuth.length > 0) {
    console.warn(`Missing OAuth credentials for: ${missingOAuth.join(', ')}`);
    console.warn('OAuth authentication will not work for these platforms.');
  }
  
  // Check redirect URI
  if (!process.env.OAUTH_REDIRECT_URI) {
    console.warn('Missing OAUTH_REDIRECT_URI. Using default: http://localhost:3001/oauth/callback');
  }
}