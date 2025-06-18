export class RoutesConstants {
    static readonly HOME = 'home';
    static readonly LOGIN = 'login';
    static readonly TODO = {
        LIST: 'todos',
        DETAILS: 'todos/:id'
    };
    static readonly ERRO = {
        GENERICO: 'error/generic',
        UNAUTHORIZED: 'error/unauthorized'
    };
}