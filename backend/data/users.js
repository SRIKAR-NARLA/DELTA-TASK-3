import bcrypt from 'bcryptjs'

const users = [
    {
        name:'Admin User',
        email:'admin@email.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:true
    },
    {
        name:'Aryan C',
        email:'aryan@email.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:false
    },
    {
        name:'K Hithesh',
        email:'hithesh@email.com',
        password:bcrypt.hashSync('123456',10),
        isAdmin:false
    }
]

export default users;