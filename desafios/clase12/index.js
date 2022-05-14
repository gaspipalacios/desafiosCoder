const fs = require("fs")

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
const Contenedor = require("./contenedores/products.js");
const contenedor1 = new Contenedor("products.json")

//POST
app.post("/", async (req, res) => {
    await contenedor1.save(req, res)
})

//------------------------FINAL PRODUCTOS---------------------------

//---------------------------CHAT------------------------------
const ContenedorArchivo = require("./contenedores/chat.js");
const mensajesApi = new ContenedorArchivo("mensajes.json");

io.on("connection", async (socket) => {
    console.log("Usuario conectado")

    socket.emit("mensajes", await mensajesApi.listarAll())
    socket.emit("productos", await contenedor1.getAll())

    socket.on("nuevoMensaje", async (mensaje) => {
        mensaje.date = new Date().toLocaleString()
        await mensajesApi.guardar(mensaje)
        io.sockets.emit("mensajes", await mensajesApi.listarAll())
    })

    socket.on("nuevoProducto", async (producto) => {
        await contenedor1.save(producto)
        io.sockets.emit("productos", await contenedor1.getAll())
    })

})

//------------------------FINAL CHAT---------------------------

//GET
app.get("/", async (req, res) => {
    res.render("form", {
        mensajes: await mensajesApi.listarAll(),
        productos: await contenedor1.getAll()
    })
})

server.listen(8080, () => {
    console.log("Server running on port 8080");
})