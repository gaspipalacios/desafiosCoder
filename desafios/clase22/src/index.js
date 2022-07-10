const prodsFakers = require('./productsFaker.js')
const express = require("express")
const app = express()

app.set("view engine", "ejs")
app.set("views", "./views")

//MIDDLEWARES
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))


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

//GET
app.get("/", async (req, res) => {
    res.render("form", {
        mensajes: await normalizado(),
        //productos: await contenedor1.getAll()
        productos: prodsFakers(6)
    })
})

server.listen(8080, () => {
    console.log("Server running on port 8080");
})