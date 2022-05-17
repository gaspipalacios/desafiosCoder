const { promises: fs } = require("fs")

const express = require("express")



const { Router } = express

let countContenedor = 5
class Contenedor {

    constructor(name) {
        this.name = name,
            this.product = []
    }

    async save(producto) {
        const productos = await this.getAll()
        
        let newId 
        if (productos == 0) {
            newId = 1
        } else {
            newId = productos[productos.length - 1].id + 1
        }

        const newProd = {...producto, id: newId}
        productos.push(newProd)

        try {
            await fs.writeFile(this.name, JSON.stringify(productos))
        } catch (error) {
            throw error
        }
        
    }

    async getAll() {
        try {
            const productos = await fs.readFile(`./${this.name}`, 'utf-8')
            return JSON.parse(productos)
        } catch (error) {
            return []
        }
    }

    async getById(id) {
        const products = await this.getAll()
        const product = products.find(e => e.id === id)
        return product
    }

    async updateById(elem, id) {
        const products = await this.getAll()
        const index = products.findIndex(e => e.id == id)
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${id}`)
        } else {
            elem = {...elem, id: id}
            products[index] = elem
            try {
                await fs.writeFile(this.name, JSON.stringify(products, null, 2))
            } catch (error) {
                throw new Error(`Error al actualizar: ${error}`)
            }
        }
    }

    /* deleteById(id){
        fs.readFile(`./${this.name}`, 'utf-8', (err, data) => {
            if(err){
                console.log(err)
            }else{
                let product = JSON.parse(data).filter(e => {
                    return e.id !== id
                })

                fs.writeFile(`./${this.name}`, JSON.stringify(product), 'utf-8', err => {
                    if(err){
                        console.log(err)
                    }else{
                        console.log('Producto borrado');
                    }
                })
            }
        })
    } */

    /* deleteAll(){
        fs.readFile(`./${this.name}`, 'utf-8', (err, data) => {
            if(err){
                console.log(err)
            }else{
                let product = JSON.parse(data)
                product = []

                fs.writeFile(`./${this.name}`, JSON.stringify(product), 'utf-8', err => {
                    if(err){
                        console.log(err)
                    }else{
                        console.log('Se eliminaron todos los productos');
                    }
                })
            }
        })
    } */
}

const contenedor1 = new Contenedor("products.json")

const router = new Router()

//GETs
router.get("/", async (req, res) => {
    const products = await contenedor1.getAll()
    res.send(products)
})

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id)
    const product = await contenedor1.getById(id)
    res.send(product)
})

//POSTs
router.post("/", async (req, res) => {
    await contenedor1.save(req.body)
    res.send("Producto cargado")
})

//PUTs
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id)
    await contenedor1.updateById(req.body, id)
    res.send("Producto modificado")
})

//Exporto router para usar en index.js
module.exports = router
