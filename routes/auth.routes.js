import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'

import validator from 'express-validator'
const { check, validationResult } = validator

import { Router } from 'express'
const router = Router()


// /api/auth/register
router.post('/register', [
    check('email', 'Uncorrectly email').isEmail(),
    check('password', 'Password must contains not less than 6 symbols').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Uncorrect data register'
            })
        }

        const { email, password } = req.body

        // проверка email. User.findOne() находит, есть ли запись
        const candidate = await User.findOne({ email: email })
        if (candidate) {
            return res.status(400).json({ message: 'User already exist' }) // 400 плохой запрос / сервер не понимает запрос
        }

        const hashedPassword = await bcrypt.hash(password, 12) // хешируем пароль
        const user = new User({ email: email, password: hashedPassword }) // создаем пользователя
        await user.save() // ждем сохранения пользователя в бд

        res.status(201).json({ message: 'User created' }) // 201 статус - что-то создаем (пользолватель создан)

    } catch (e) {
        // 500 - серверная ошибка
        res.status(500).json({ message: 'Server error. Try again' })
    }
})

// /api/auth/login
router.post('/login', [
    check('email', 'Enter correct email').normalizeEmail().isEmail(),
    check('password', 'Enter password').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Uncorrect data login'
            })
        }

        const { email, password } = req.body
        const user = await User.findOne({ email })
        console.log('User:', user)

        if (!user) {
            return res.status(400).json({ message: 'This user is not exist' })
        }

        if (await !bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Password is not match' })
        }

        const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), { expiresIn: '1h' })

        res.json({ token, userId: user.id })

    } catch (e) {
        // 500 - серверная ошибка
        res.status(500).json({ message: 'Server error. Try again' })
    }
})

export default router