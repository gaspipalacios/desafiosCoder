import { promises as fs } from 'fs'
import config from '../config.js'

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = `${config.fileSystem.path}/${ruta}`;
    }

    async save(obj) {
        const objs = await this.getAll()

        let newId
        if (objs.length == 0) {
            newId = 1
        } else {
            newId = objs[objs.length - 1].id + 1
        }

        const timestamp = new Date().toLocaleString()
        const newObj = { ...obj, timestamp: timestamp, id: newId }
        objs.push(newObj)

        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            return newObj
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }

    }

    async getAll() {
        try {
            const objs = await fs.readFile(this.ruta, 'utf-8')
            return JSON.parse(objs)
        } catch (error) {
            return []
        }
    }

    async getById(id) {
        const objs = await this.getAll()
        const objWanted = objs.find(e => e.id == id)
        return objWanted
    }

    async update(elem, id) {
        const objs = await this.getAll()
        const index = objs.findIndex(e => e.id == id)
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${id}`)
        } else {
            objs[index] = elem
            try {
                await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            } catch (error) {
                throw new Error(`Error al actualizar: ${error}`)
            }
        }
    }

    async deleteAll() {
        try {
            await fs.writeFile(this.ruta, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al intentar borrar todo: ${error}`)
        }
    }

    async deleteById(id) {
        const objs = await this.getAll()
        const index = objs.findIndex(e => e.id == id)

        if (index == -1) {
            throw new Error(`Error, no se encontró el id: ${id}`)
        }

        objs.splice(index, 1)
        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
        } catch (error) {
            throw new Error(`Error al intentar borrar: ${error}`)
        }

    }

}

export default ContenedorArchivo