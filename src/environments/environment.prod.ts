export const environment = {
  production: true,
  apiUrl: 'https://alarido-api.onrender.com',
  bible: {
    defaultBibleId: '35b94e98b2e3a01a-01',
  },
  keycloak: {
    issuer: 'https://alarido-keycloak.onrender.com/realms/alarido',
    clientId: 'alarido-web',
    redirectUri: 'https://gabriieldev.github.io/alarido-site/auth/callback',
    postLogoutRedirectUri: 'https://gabriieldev.github.io/alarido-site/login',
    scope: 'openid profile email',
  },
};
