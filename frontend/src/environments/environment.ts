export const environment = {
    production: false,
    api: {
        urlBase: 'http://localhost:5183/api',
        endpoints: {
            todos: 'todo',
            auth: {
                login: 'auth/login',
                logout: 'auth/logout',
                refreshToken: 'auth/refresh-token'
            }
        },
    }
}