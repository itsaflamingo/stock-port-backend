interface User extends Express.User {
    id: number;
    username: string;
    password: string;
    email: string;
}

export { User };