export const environment = {
    production: true,
    api: {
        urlBase: 'http://localhost:5000/api',
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