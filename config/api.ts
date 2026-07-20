const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export const BASE_URL: string = (
  configuredBaseUrl || 'http://localhost:8080'
).replace(/\/$/, '');
