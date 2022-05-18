const { promises: fs } = require("fs")

const express = require("express")

const { Router } = express

class Contenedor {

    constructor(name) {
        this.name = name
    }

    async save(producto) {
        const productos = await this.getAll()

        let newId
        if (productos == 0) {
            newId = 1
        } else {
            newId = productos[productos.length - 1].id + 1
        }

        const timestamp = new Date().toLocaleString()
        const newProd = { ...producto, timestamp: timestamp, id: newId }
        productos.push(newProd)

        try {
            await fs.writeFile(this.name, JSON.stringify(productos, null, 2))
        } catch (error) {
            throw error
        }

    }

    async getAll() {
        try {
            const productos = await fs.readFile(this.name, 'utf-8')
            return JSON.parse(productos)
        } catch (error) {
            return []
        }
    }

    async getById(id) {
        const products = await this.getAll()
        const product = products.find(e => e.id == id)
        return product
    }

    async updateById(elem, id) {
        const products = await this.getAll()
        const index = products.findIndex(e => e.id == id)
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${id}`)
        } else {
            elem = { ...elem, id: id }
            products[index] = elem
            try {
                await fs.writeFile(this.name, JSON.stringify(products, null, 2))
            } catch (error) {
                throw new Error(`Error al actualizar: ${error}`)
            }
        }
    }

    async deleteAll() {
        try {
            await fs.writeFile(this.name, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al intentar borrar todos los productos: ${error}`)
        }
    }

    async deleteById(id) {
        const products = await this.getAll()
        const index = products.findIndex(e => e.id == id)

        if (index == -1) {
            throw new Error(`Error, no se encontró el id: ${id}`)
        } else {
            products.splice(index, 1)
            try {
                await fs.writeFile(this.name, JSON.stringify(products, null, 2))
            } catch (error) {
                throw new Error(`Error al intentar borrar prodcuto: ${error}`)
            }
        }
    }

}

const contenedor1 = new Contenedor("products.json")


const router = new Router()

//GETs
// 1.a) 
router.get("/", async (req, res) => {
    const products = await contenedor1.getAll()
    res.send(products)
})

router.get("/:id", async (req, res) => {
    const id = req.params.id
    const product = await contenedor1.getById(id)
    res.send(product)
})

//POSTs
//2.b) Para incorporar productos al listado (disponible para administradores)
router.post("/", async (req, res) => {
    if (req.query.admin) {
        await contenedor1.save(req.body)
        res.send("Producto cargado")
    } else {
        res.send("No tienes permiso para realizar esta acción")
    }

})

//PUTs
//2.c) Actualiza un producto por su id (disponible para administradores)
router.put("/:id", async (req, res) => {
    if (req.query.admin) {
        const id = Number(req.params.id)
        await contenedor1.updateById(req.body, id)
        res.send("Producto modificado")
    } else {
        res.send("No tienes permiso para realizar esta acción")
    }
})

//DELETEs
router.delete("/", async (req, res) => {
    if (req.query.admin) {
        await contenedor1.deleteAll()
        res.send("Productos borrados")
    } else {
        res.send("No tienes permiso para realizar esta acción")
    }
})

//2.d) Borra un producto por su id (disponible para administradores)
router.delete("/:id", async (req, res) => {
    if (req.query.admin) {
        const id = req.params.id
        await contenedor1.deleteById(id)
        res.send("Producto eliminado")
    } else {
        res.send("No tienes permiso para realizar esta acción")
    }
})

//Exporto router para usar en index.js
module.exports = router
