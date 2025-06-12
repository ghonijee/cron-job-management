interface EnvConfig {
  API_BASE_URL: string;
  APP_NAME: string;
  APP_VERSION: string;
  ENABLE_MOCK_API: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

function getBooleanEnvVar(key: string, defaultValue = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

export const env: EnvConfig = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL'),
  APP_NAME: getEnvVar('VITE_APP_NAME'),
  APP_VERSION: getEnvVar('VITE_APP_VERSION'),
  ENABLE_MOCK_API: getBooleanEnvVar('VITE_ENABLE_MOCK_API'),
};

// Validate environment variables at startup
export function validateEnv(): void {
  try {
    // Access all required env vars to trigger validation
    console.log(`Starting ${env.APP_NAME} v${env.APP_VERSION}`);
    console.log(`API Base URL: ${env.API_BASE_URL}`);
    console.log(`Mock API Enabled: ${env.ENABLE_MOCK_API}`);
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw error;
  }
}
