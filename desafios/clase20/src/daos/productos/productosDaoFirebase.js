import Contenedorfirebase from "../../contenedores/contenedorFirebase.js"

class ProductosDaoFirebase extends Contenedorfirebase{
    constructor(){
        super('products')
    }

}

export default ProductosDaoFirebase