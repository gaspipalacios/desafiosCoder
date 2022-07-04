import Contenedorfirebase from "../../contenedores/contenedorFirebase.js"

class CarritosDaoFirebase extends Contenedorfirebase{
    constructor(){
        super('carts')
    }

}

export default CarritosDaoFirebase