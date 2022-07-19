const socket = io.connect();

const chatForm = document.querySelector("#chat")
const inputId = document.querySelector('#id')
const inputName = document.querySelector("#nb")
const inputApellido = document.querySelector('#ap')
const inputEdad = document.querySelector('#edad')
const inputAlias = document.querySelector('#alias')
const inputAvatar = document.querySelector('#avatar')
const inputMensaje = document.querySelector("#msn")

const productForm = document.querySelector("#productForm")
const inputNameProduct = document.querySelector("#product_name")
const inputPriceProduct = document.querySelector("#product_price")
const inputUrlProduct = document.querySelector("#producto_url")

chatForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const mensaje = {
        autor: {
            id: inputId.value,
            nombre: inputName.value,
            apellido: inputApellido.value,
            edad: inputEdad.value,
            alias: inputAlias.value,
            avatar: inputAvatar.value
        },
        texto: inputMensaje.value
    };
    socket.emit("nuevoMensaje", mensaje);
    inputMensaje.value = "";
});

socket.on("mensajes", (mensajes) => {
    const autoresSchema = new normalizr.schema.Entity('autores')
    const mensajeSchema = new normalizr.schema.Entity('mensajes', {
        autor: autoresSchema
    })
    const mensjDesnormalizado = normalizr.denormalize(mensajes.result, [mensajeSchema], mensajes.entities)
    const largoNormalizado = JSON.stringify(mensajes).length
    const largoSinNormalizar = JSON.stringify(mensjDesnormalizado).length
    const porcentajeCompresion = ((1 - (largoNormalizado/largoSinNormalizar))*100).toFixed(2)
    
    document.querySelector("#compresion").innerHTML = `<h4>Compresión de mensajes: ${porcentajeCompresion}%</h4>`

    const mensajesHTML = mensjDesnormalizado
        .map(
            (mensaje) =>
                `<div>
              <b style="color: blue">${mensaje.autor.alias}</b>
              <span style="color: brown">${mensaje.date}</span>
              <i style="color: green">${mensaje.texto}</i>
        </div>`
        )
        .join(" ");
    document.querySelector("#mensajes").innerHTML = mensajesHTML;

})

productForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const producto = {
        productName: inputNameProduct.value,
        price: inputPriceProduct.value,
        thumbnail: inputUrlProduct.value
    }

    socket.emit("nuevoProducto", producto);
    inputNameProduct.value = ""
    inputPriceProduct.value = ""
    inputUrlProduct.value = ""
});

socket.on("productos", (productos) => {
    const productosHTML = productos && productos
        .map(
            (product) =>
                `<tr>
      <th scope="row">
        ${product.id}
      </th>
      <td>
        ${product.productName}
      </td>
      <td>
        ${product.price}
      </td>
      <td>
          <a target="_blank" href=${product.thumbnail} > Ver imagen </a>
      </td>
    </tr>
    `
        )
        .join(" ");
    document.querySelector("#productos").innerHTML = productosHTML

})