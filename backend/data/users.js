import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@email.com',
        password: bcrypt.hashSync('123456', 10), // Hashed password for '123456'
        role: 'admin',
        tofriends: [],
        fromfriends:[]
    },
    {
        name: 'Aryan C',
        email: 'aryan@email.com',
        password: bcrypt.hashSync('123456', 10), // Hashed password for '123456'
        role: 'user',
        tofriends: [],
        fromfriends:[]
    },
    {
        name: 'K Hithesh',
        email: 'hithesh@email.com',
        password: bcrypt.hashSync('123456', 10), // Hashed password for '123456'
        role: 'artist',
        tofriends: [],
        fromfriends:[]
    }
];

export default users;
