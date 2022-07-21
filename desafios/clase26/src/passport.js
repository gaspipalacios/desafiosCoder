const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const ContenedorMongoDb = require("../contenedores/contenedorMongoDB.js")
const usersContenedor = new ContenedorMongoDb()

passport.use('signup', new LocalStrategy(async (username, password, callback) => {
    const users = await usersContenedor.getAll()
    const user = users.find(user => user.username === username)
    if(user) return callback(new Error('Ese username ya existe, prueba otro'))
    const passwordHasheado = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const usuarioCreado = {username, password: passwordHasheado}
    await usersContenedor.save(usuarioCreado)
    callback(null, usuarioCreado)
}))

passport.use('login', new LocalStrategy(async (username, password, callback) => {
    const users = await usersContenedor.getAll()
    const user = users.find(usuario => usuario.username === username)
    console.log(user);
    if(!user || bcrypt.compareSync(password, user.password)) return callback(new Error('Usuario inexistente o password incorrecto'))
    callback(null, user)
}))

passport.serializeUser((usuario, callback) => {
    callback(null, usuario.username)
})

passport.deserializeUser(async (username, callback) => {
    const users = await usersContenedor.getAll()
    const user = users.find(usr => usr.username == username)
    callback(null, user)
})

module.exports = passport