const { promises: fs } = require('fs')

const knex = require("../src/db")

class Contenedor {

    constructor(name) {
        this.name = name
    }

    save(req, res) {
        const productNew = {
            productName: req.body.productName,
            price: req.body.price,
            thumbnail: req.body.thumbnail
        }

        knex("products")
        .insert(productNew)
        .then(() => {
            console.log("Registro OK")
            res.send({ message: "Registro OK" })
        })
        .catch((error) => {
            console.log(error);
        })

        
    }

    async getAll() {
        try {
            const productos = await fs.readFile(`./${this.name}`, 'utf-8')
            return JSON.parse(productos)
        } catch (error) {
            return []
        }
    }

}

module.exports = Contenedor




