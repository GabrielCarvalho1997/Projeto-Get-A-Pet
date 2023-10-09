const createUserToken = require('../helpers/create-user-token');
const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class UserController {
    static async register(req, res) {

        const { name, email, phone, password, confirmPassword } = req.body;

        // Validations
        if (!name) {
            return res.status(422).json({ message: 'O nome é obrigatório!' })
        }

        if (!email) {
            return res.status(422).json({ message: 'O email é obrigatório!' })
        }

        if (!phone) {
            return res.status(422).json({ message: 'O telefone é obrigatório!' })
        }

        if (!password) {
            return res.status(422).json({ message: 'A senha é obrigatória!' })
        }

        if (!confirmPassword) {
            return res.status(422).json({ message: 'A confirmação da senha é obrigatória!' })
        }

        if (password !== confirmPassword) {
            return res.status(422).json({ message: 'As senhas não coincidem!' })
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(422).json({ message: 'Já existe um usuário com este email!' })
        }

        // create a password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // create a new user
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        });

        // save user
        try {
            const savedUser = await user.save();
            await createUserToken(savedUser, req, res);
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;

        // Validations
        if (!email) {
            return res.status(422).json({ message: 'O email é obrigatório!' })
        }

        if (!password) {
            return res.status(422).json({ message: 'A senha é obrigatória!' })
        }

        // Check if user exists
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado!' })
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(422).json({ message: 'Senha inválida!' })
        }

        await createUserToken(user, req, res);

    }
} 