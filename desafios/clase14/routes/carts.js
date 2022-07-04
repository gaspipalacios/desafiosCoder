const { promises: fs } = require("fs")

const express = require("express")

const { Router } = express
const router = new Router()

class Cart {

    constructor(name) {
        this.name = name
    }

    async save(cart) {
        const carts = await this.getAll()

        let newId
        if (carts == 0) {
            newId = 1
        } else {
            newId = carts[carts.length - 1].id + 1
        }

        const timestamp = new Date().toLocaleString()
        const newCart = { ...cart, timestamp: timestamp, id: newId }
        carts.push(newCart)

        try {
            await fs.writeFile(this.name, JSON.stringify(carts, null, 2))
        } catch (error) {
            throw new Error(`Error al guardar carrito: ${error}`)
        }

    }

    async getAll() {
        try {
            const carts = await fs.readFile(this.name, 'utf-8')
            return JSON.parse(carts)
        } catch (error) {
            throw new Error(`Error al listar carritos: ${error}`)
        }
    }

    async getProductsByCartId(id) {
        const carts = await this.getAll()
        const cart = carts.find(e => e.id == id)
        const cartProducts = cart["productos"]
        return cartProducts
    }

    async deleteAll() {
        try {
            await fs.writeFile(this.name, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al intentar borrar todos los productos: ${error}`)
        }
    }

    async deleteById(id) {
        const carts = await this.getAll()
        const index = carts.findIndex(e => e.id == id)

        if (index == -1) {
            throw new Error(`Error, no se encontró el id: ${id}`)
        } else {
            carts.splice(index, 1)
            try {
                await fs.writeFile(this.name, JSON.stringify(carts, null, 2))
            } catch (error) {
                throw new Error(`Error al intentar borrar prodcuto: ${error}`)
            }
        }
    }

    async removeProduct(idCart, idProd) {
        const carts = await this.getAll()
        const indexCart = carts.findIndex(e => e.id == idCart)

        if (indexCart == -1) {
            throw new Error(`Error, no se encontró el id del carrito: ${idCart}`)
        } else {
            const products = carts[indexCart]["productos"]
            const indexProd = products.findIndex(e => e.id == idProd)

            if (indexProd == -1) {
                throw new Error(`Error, no se encontró el id del producto: ${idProd}`)
            } else {
                carts[indexCart]["productos"].splice(indexProd, 1)
                try {
                    await fs.writeFile(this.name, JSON.stringify(carts, null, 2))
                } catch (error) {
                    throw new Error(`Error al intentar borrar prodcuto: ${error}`)
                }
            }
        }
    }

    async addProduct(idCart, idProd) {
        const addProduct = JSON.parse(await fs.readFile("./products.json", 'utf-8')).find(e => e.id == idProd)

        const carts = await this.getAll()
        const indexCart = carts.findIndex(e => e.id == idCart)

        if (indexCart == -1) {
            throw new Error(`Error, no se encontró el id del carrito: ${idCart}`)
        }

        carts[indexCart]["productos"].push(addProduct)
        try {
            await fs.writeFile(this.name, JSON.stringify(carts, null, 2))
        } catch (error) {
            throw new Error(`Error al intentar borrar prodcuto: ${error}`)
        }

    }

}

const carts = new Cart("carts.json")

//GETs
// 2.c) Me permite listar todos los productos guardados en el carrito
router.get("/:id/productos", async (req, res) => {
    const cartProducts = await carts.getProductsByCartId(req.params.id)
    res.send(cartProducts)
})

//POSTs
// 2.a) Crea un carrito
router.post("/", async (req, res) => {
    await carts.save(req.body)
    res.send("Carrito guardado")
})

// 2.d) Para incorporar productos al carrito por su id de producto
router.post("/:id/:idProd", async (req, res) => {
    await carts.addProduct(req.params.id, req.params.idProd)
    res.send("Producto agregado al carrito")
})

//DELETEs
// 2.b) Elimina un carrito
router.delete("/:id", async (req, res) => {
    await carts.deleteById(req.params.id)
    res.send("Carrito eliminado")
})

// 2.e) Eliminar un producto del carrito por su id de carrito y de producto
router.delete("/:id/:idProd/:remove", async (req, res) => {
    await carts.removeProduct(req.params.id, req.params.idProd)
    res.send("Producto removido del carrito")
})

module.exports = router