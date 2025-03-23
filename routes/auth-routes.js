const Router = require('express')
const router = new Router() // сначало идут импорты, потом уже остальное
const userController = require('../controller/user-contoller')
const {check} = require('express-validator') // поменяй импорты на modulejs

router.post('/register', [
    check('login', "Логин должен содержать минимум 3 символа").isLength({min:3}),
    check('login', "Логин может содержать только буквы, цифры и _").matches(/^[a-zA-Z0-9_]+$/),
    check('password',"Пароль должен быть больше 4 и меньше 10 символов").isLength({min:4, max:10}),
    check('email',"Некоректный email").isEmail()
], userController.register)
router.post('/login', userController.login)
router.get('/users', userController.allUsers)


module.exports=router