const mongoose = require("mongoose")
const {Schema, model} = mongoose

mongoose.connect('mongodb+srv://gaspar-1:gaspar1@cluster-ecommerce.ppngn.mongodb.net/ecommerce2?retryWrites=true&w=majority')

class ContenedorMongoDb {

    constructor(){
        this.colection = model("users", new Schema({
            username: {type: String, required: true},
            password: {type: String, required: true}
        }))
    }

    async save(obj){
        try{
            const doc = await this.colection.create(obj)
            return doc
        }catch (error) {
            throw new Error(`Error al guardar ${error}`)
        }
    }

    async getAll(){
        try{
            const doc = await this.colection.find()
            return doc
        }catch(error){
            throw new Error(`Error al obtener elementos: ${error}`)
        }
    }

    async getById(id){
        try{
            const doc = await this.colection.find({_id: id})
            if(doc.length == 0){
                throw new Error('Error: id no encontrado')
            }else{
                const docObj = JSON.parse(JSON.stringify(doc[0]))
                return docObj
            }
        }catch(error){
            throw new Error(`Error al recuperar elemento: ${error}`)
        }
    }

    async update(obj, id){
        try{
            let elem = await this.colection.find({_id: id})
            if(elem.length == 0){
                throw new Error('Error, id no encontrado')
            }else{
                return await this.colection.findOneAndUpdate({_id:id}, obj)
            }
        }catch(error){
            throw new Error(`Error al actualizar elemento: ${error}`)
        }
    }

    async deleteAll(){
        try{
            await this.colection.deleteMany()
        }catch{
            throw new Error(`Error al borrar todo: ${error}`)
        }
    }

    async deleteById(id){
        try{
            const doc = await this.colection.find({_id: id})
            if(doc.length == 0){
                throw new Error('Error al borrar elemento: id no encontrado')
            }else{
            await this.colection.deleteOne({_id: id})
            }
        }catch(error){
            throw new Error(`Error al borrar elemento: ${error}`)
        }
    }
}

module.exports = ContenedorMongoDb