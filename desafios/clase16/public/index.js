const socket = io.connect();

const chatForm = document.querySelector("#chat")
const inputName = document.querySelector("#nb")
const inputMensaje = document.querySelector("#msn")

const productForm = document.querySelector("#productForm")
const inputNameProduct = document.querySelector("#product_name")
const inputPriceProduct = document.querySelector("#product_price")
const inputUrlProduct = document.querySelector("#producto_url")

chatForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const mensaje = {
        autor: inputName.value,
        texto: inputMensaje.value,
    };
    socket.emit("nuevoMensaje", mensaje);
    inputMensaje.value = "";
});

socket.on("mensajes", (mensajes) => {
    const mensajesHTML = mensajes
        .map(
            (mensaje) =>
                `<div>
              <b style="color: blue">${mensaje.autor}</b>
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
    const productosHTML = productos
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