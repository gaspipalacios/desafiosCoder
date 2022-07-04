class ContenedorMemoria {

    constructor() {
        this.elementos = []
    }

    getById(id) {
        const elem = this.elementos.find(e => e.id == id)
        if (!elem) {
            throw new Error(`Error al listar: elemento no encontrado`)
        } else {
            return elem
        }
    }

    getAll() {
        return [...this.elementos]
    }

    save(elem) {

        let newId
        if (this.elementos.length == 0) {
            newId = 1
        } else {
            newId = this.elementos[this.elementos.length - 1].id + 1
        }

        const newElem = { ...elem, id: newId }
        this.elementos.push(newElem)
        return newElem
    }

    update(elem) {
        const index = this.elementos.findIndex(e => e.id == elem.id)
        if (index == -1) {
            throw new Error(`Error al actualizar: elemento no encontrado`)
        } else {
            this.elementos[index] = elem
            return elem
        }
    }

    deleteById(id) {
        const index = this.elementos.findIndex(e => e.id == id)
        if (index == -1) {
            throw new Error(`Error al borrar: elemento no encontrado`)
        } else {
            return this.elementos.splice(index, 1)
        }
    }

    deleteAll() {
        this.elementos = []
    }
}

export default ContenedorMemoria
