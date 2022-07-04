import ContenedorMongoDb from "../../contenedores/contenedorMongoDB.js";

class CarritosDaoMongoDb extends ContenedorMongoDb {
    constructor() {
        super('carts', {
            productos: { type: [], required: true }
        })
    }

}

export default CarritosDaoMongoDb