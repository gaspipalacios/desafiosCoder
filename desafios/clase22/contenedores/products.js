const knex = require("../src/db")

class Contenedor {

    constructor(name) {
        this.name = name
    }

    save(producto) {
        const productNew = {
            productName: producto.productName,
            price: producto.price,
            thumbnail: producto.thumbnail
        }

        knex("products")
        .insert(productNew)
        .then(() => {
            console.log("Producto guardado")
        })
        .catch((error) => {
            console.log(error);
        })

        
    }

    async getAll() {
        const productos = 
        await knex("products").select('*')
        
        return productos
    }

}

module.exports = Contenedor




