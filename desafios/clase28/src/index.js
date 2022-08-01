//DOTENV
const dotenv = require('dotenv')
dotenv.config()
const mongoDBsessions = process.env.MONGODBSESSIONS
//--------------------------

//FORK----------------
const { fork } = require('child_process')
//--------------------

const prodsFakers = require('./productsFaker.js')
const express = require("express")
const passport = require('./passport')

//Router-----------------------
const { Router } = express
const forkRouter = new Router()
//------------------------------

//YARGS usado para leer el puerto pasado por línea de comando
const yargs = require('yargs/yargs')(process.argv.slice(2))
const port = yargs.argv.p || 8080

//SESSION MONGO ATLAS
const session = require('express-session')
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const app = express()

//CONFIGURO EJS
app.set("view engine", "ejs")
app.set("views", "./views")

//MIDDLEWARES
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))

//Middleware Router
app.use('/api', forkRouter)
//-----------------

//MIDDLEWARE SESSION MONGO ATLAS
app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoDBsessions,
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
const info = {
    cwd: process.cwd(),
    processId: process.pid,
    nodeVersion: process.version,
    SO: process.platform,
    rss: process.memoryUsage.rss(),
    argvs: yargs.argv
}
//GETs--------------------------------------------------
app.get("/", auth, async (req, res) => {
    res.render("form", {
        mensajes: await normalizado(),
        //productos: await contenedor1.getAll()
        productos: prodsFakers(6),
        user: req.user.username
    })
})
app.get("/login", async (_, res) => res.render("login", {}))
app.get("/signup", async (_, res) => res.render("signup"))
app.get('/info', auth, (_, res) => res.json(info))
//-------------------------------------------------------------

//GETs Router-------------------------------------------
forkRouter.get('/randoms', (req, res) => {
    const forkeado = fork('./src/noBlock.js', [req.query])
    forkeado.send('empezar')
    forkeado.on('message', (resultado) => {
        if (resultado) {
            res.send(resultado)
        }else{
            res.send('No se pudo realizar el calculo!')
        }
    })
    
})
//------------------------------------------------------

//POST--------------------------------------------------
app.post('/login', passport.authenticate('login'), (req, res) => res.redirect('/'))
app.post('/signup', passport.authenticate('signup'), (req, res) => res.redirect('/'))
app.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        res.redirect('/')
    })
})

//---------------------------------

server.listen(port, () => {
    console.log(`Escuchando, puerto ${port}.`);
})