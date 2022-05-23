const { log } = require('console')
const { promises: fs } = require('fs')
const { resolve } = require('path')

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

    getAll() {
        
        knex
            .from('products')
            .select('*')
            .then((json) => {
                
                return json
                
            })
            .catch((error) => {
                console.log(error);
            })
    }

}

module.exports = Contenedor




