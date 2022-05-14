const { promises: fs } = require('fs')

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

}

module.exports = Contenedor




