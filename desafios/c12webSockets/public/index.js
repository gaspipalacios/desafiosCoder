const socket =io()

//CONEXIÓN CON BACKEND, ESCUCHAR Y EMITIR 
socket.on("mensajes", (mensajes) => { 
    console.log(mensajes);
    render(mensajes)
    socket.emit("message_client", "Mensaje enviado")
}) 

//FUNCIÓN PARA IMPRIMIR MENSAJES EN PANTALLA
const render = (mensajes) => {
    let html = mensajes.map((e) => {
        return `
            <p> <strong> ${e.nombre}: </strong> ${e.msn} </p>
        `
    }).join(" ")

    document.querySelector("#caja").innerHTML = html

    console.log(mensajes);
}

//FUNCIÓN PARA CAPTAR MENSAJE ENVIADO POR USUARIO A TRAVÉS DEL FORM Y ENVIARLO AL BACKEND 
const addInfo = () => {
    let dataObj = {nombre: document.querySelector("#nb").value, msn: document.querySelector("#msn").value}
    socket.emit("dataMsn", dataObj)
    console.log(dataObj)
    document.querySelector("#msn").value = ""
}

//PREVENGO SUBMIT DEL FORM HTML PARA QUE TOME LA FUNCIÓN "addInfo()""
document.addEventListener("submit", (evt) => {
    evt.preventDefault()
})

