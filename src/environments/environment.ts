export const environment = {
  production: false,
  apiUrl: 'https://alarido-api.onrender.com',
  bible: {
    defaultBibleId: '35b94e98b2e3a01a-01',
  },
  keycloak: {
    issuer: 'https://alarido-keycloak.onrender.com/realms/alarido',
    clientId: 'alarido-web',
    redirectUri: 'http://localhost:4200/auth/callback',
    postLogoutRedirectUri: 'http://localhost:4200/login',
    scope: 'openid profile email',
  },
};
