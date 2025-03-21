const prisma = require('../prisma/prismaClient');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const {secret} = require("../config")
const fs = require('fs')
const path = require('path')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class userController{
    async register(req, res){
        try {

            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message: "Ошибка при регестрации", errors})
            }
            const {login, password, email} = req.body
            const hashedPassword = await bcrypt.hash(password, 7)
            const candidate = await prisma.person.findUnique({ where:{login}})

            if (candidate){ 
                return res.status(400).json({message: "Такой логин уже есть"})
            }

            const newUser = await prisma.person.create({
                data: {
                    login,
                    password: hashedPassword,
                    email,
                },
            });

            const folderPath = path.resolve(__dirname, "../user_folder", `${login}_folder`)
            fs.mkdir(folderPath, { recursive: true }, (err) => {
                if (err) {
                    res.status(400).json({message: 'Ошибка создания папки'})
                    return;
                }
            });

            res.json({ 
                success: true, 
                message: 'Аккаунт создан', 
                user: newUser 
            });
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res){
        try {
            const {login, password} = req.body
            const user = await prisma.person.findUnique({where: {login}})
            if(!user){
                return res.status(400).json({message:`Пользователь ${login} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword){
                return res.status(400).json({message:`Неверный пароль`})
            }
            const updateActive = await prisma.person.update({where: {login: login}, data: {online: true}});
            const token = generateAccessToken(user.id)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }   
    }
    async allUsers(req, res){
        try {
            const users = await prisma.person.findMany();
            res.json(users)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Ошибка при получении пользователей"})
        }  
    }
}

module.exports = new userController()
