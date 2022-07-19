const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const users = []

passport.use('signup', new LocalStrategy((username, password, callback) => {
    const user = users.find(user => user.username === username)
    if(user) return callback(new Error('Ese username ya existe, prueba otro'))
    const passwordHasheado = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    const usuarioCreado = {username, password: passwordHasheado}
    users.push(usuarioCreado)
    callback(null, usuarioCreado)
}))

passport.use('login', new LocalStrategy((username, password, callback) => {
    const user = users.find(usuario => usuario.username === username)
    console.log(user);
    if(!user || bcrypt.compareSync(password, user.password)) return callback(new Error('Usuario inexistente o password incorrecto'))
    callback(null, user)
}))

passport.serializeUser((usuario, calback) => {
    calback(null, usuario.username)
})

passport.deserializeUser((username, calback) => {
    const user = users.find(usr => usr.username == username)
    calback(null, user)
})

module.exports = passport