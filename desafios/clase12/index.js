const express = require("express")
const app = express()

const productsRoute = require("./routes/products.js")

app.set("view engine", "ejs")
app.set("views", "./views")

//Para poder leer req.body
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Uso de la ruta products
app.use("/api/products", productsRoute)

//ARCHIVOS ESTÁTICOS
app.use(express.static('public'))

//DATA
let mensajes = []
//SERVER
const http = require("http")
const server = http.createServer(app)

//SOCKET
const { Server } = require("socket.io")
const io = new Server(server)

//CONEXIÓN, EMITIR Y ESCUCHAR
io.on("connection", (socket) => {  
    socket.emit("mensajes", mensajes) 

    socket.on("message_client", (data) => {
        console.log(data);
    })

    socket.on("dataMsn", (data) => { 
        console.log(data)
        mensajes.push(data) 
        io.sockets.emit("mensajes", mensajes)
    })
})

app.listen(8080, () => {
    console.log("Server running on port 8080");
})