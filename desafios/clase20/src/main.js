import app from "./server.js";

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${server.address().port}`);
})
server.on('error', error => console.log(`Error en el servidor ${error}`))