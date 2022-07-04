import ContenedorArchivo from "../../contenedores/contenedorArchivo.js"

class CarritosDaoArchivo extends ContenedorArchivo {
    constructor(){
        super('carts.json')
    }

}

export default CarritosDaoArchivo