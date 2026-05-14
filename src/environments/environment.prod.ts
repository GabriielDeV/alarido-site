export const environment = {
  production: true,
  apiUrl: 'https://alarido-api.onrender.com',
  apiBible: {
    baseUrl: 'https://rest.api.bible/v1',
    apiKey: 'clChXBhb1SKGwzI3C2bTU',
    defaultBibleId: '35b94e98b2e3a01a-01',
    defaultLanguage: 'por',
    defaultContentType: 'html',
  },
  keycloak: {
    issuer: 'https://alarido-keycloak.onrender.com/realms/alarido',
    clientId: 'alarido-web',
    redirectUri: 'https://gabriieldev.github.io/alarido-site/auth/callback',
    postLogoutRedirectUri: 'https://gabriieldev.github.io/alarido-site/login',
    scope: 'openid profile email',
  },
};
