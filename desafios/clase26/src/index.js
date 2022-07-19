const prodsFakers = require('./productsFaker.js')
const express = require("express")
const passport = require('./passport')

//SESSION MONGO ATLAS
const session = require('express-session')
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }


const app = express()

app.set("view engine", "ejs")
app.set("views", "./views")

//MIDDLEWARES
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))

//MIDDLEWARE SESSIONMONGO ATLAS
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://gaspar-1:gaspar1@cluster-ecommerce.ppngn.mongodb.net/sessionsDB?retryWrites=true&w=majority',
        mongoOptions: advancedOptions,
        ttl: 600
    }),
    secret: 'Gaspar',
    resave: true,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

//SERVER
const http = require("http")
const server = http.createServer(app)

//SOCKET
const { Server } = require("socket.io")
const io = new Server(server)

//------------------------PRODUCTOS--------------------------------
//const Contenedor = require("../contenedores/products.js");
//const contenedor1 = new Contenedor("products.json")


//POST
app.post("/", (req, res) => {
    contenedor1.save(req, res)
})

//------------------------FINAL PRODUCTOS---------------------------

//---------------------------INSTANCIO CONTENEDOR-------------------
const ContenedorArchivo = require("../contenedores/chat.js");

const mensajesApi = new ContenedorArchivo("mensajes.json");

//NORMALIZO MENSAJES DEL CHAT
const normalizr = require('normalizr')

const autoresSchema = new normalizr.schema.Entity('autores')
const mensajeSchema = new normalizr.schema.Entity('mensajes', {
    autor: autoresSchema
})

const normalizado = async () => {
    const mensajes = await mensajesApi.listarAll()
    const normalizado = normalizr.normalize(mensajes, [mensajeSchema])

    return normalizado
}

//-------------------------------------------------------------

//---------------------------CHAT------------------------------
io.on("connection", async (socket) => {
    console.log("Usuario conectado")

    socket.emit("mensajes", await normalizado())
    socket.emit("productos", prodsFakers(6))


    socket.on("nuevoMensaje", async (mensaje) => {
        mensaje.date = new Date().toLocaleString()
        await mensajesApi.guardar(mensaje)
        io.sockets.emit("mensajes", await normalizado())
    })

    socket.on("nuevoProducto", async (producto) => {
        await contenedor1.save(producto)
        io.sockets.emit("productos", prodsFakers(6))
    })

})

//------------------------FINAL CHAT---------------------------

//-----------AUTENTICACIÓN---------------
const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}
//----------------------------------------

//GETs

app.get("/", auth, async (req, res) => {
    res.render("form", {
        mensajes: await normalizado(),
        //productos: await contenedor1.getAll()
        productos: prodsFakers(6),
        user: req.user.username
    })
})
app.get("/login", async (req, res) => res.render("login", {}))
app.get("/signup", async (req, res) => res.render("signup"))

//-------------------------------------------------------------
//POST
app.post('/login', passport.authenticate('login'), (req, res) => res.redirect('/'))
app.post('/signup', passport.authenticate('signup'), (req, res) => res.redirect('/'))
app.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        res.redirect('/')
    })
})

//---------------------------------

server.listen(8080, () => {
    console.log("Server running on port 8080");
})