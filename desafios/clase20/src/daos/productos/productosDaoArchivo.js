import ContenedorArchivo from "../../contenedores/contenedorArchivo.js";

class ProductosDaoArchivo extends ContenedorArchivo {
    constructor(){
        super('products.json')
    }

}

export default ProductosDaoArchivo