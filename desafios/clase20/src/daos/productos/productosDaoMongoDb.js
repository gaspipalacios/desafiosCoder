import ContenedorMongoDb from "../../contenedores/contenedorMongoDB.js";

class ProductosDaoMongoDb extends ContenedorMongoDb{
    constructor(){
        super('products', {
            name: {type: String, required: true},
            price: {type: Number, required: true},
            description: {type: String, required: true},
            stock: {type: Number, required: true},
            code: {type: String, required: true},
            thumbnail: {type: String, required: true}
        })
    }
}

export default ProductosDaoMongoDb