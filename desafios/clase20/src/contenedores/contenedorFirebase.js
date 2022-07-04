import admin from 'firebase-admin'
import config from '../config.js'

admin.initializeApp({
    credential: admin.credential.cert(config.firebase)
})

const db = admin.firestore()

class Contenedorfirebase {
    constructor(colection){
        this.colection = db.collection(colection)
    }

    async save(obj){
        try{
            const doc = await this.colection.add(obj)
            return {...obj, id:doc.id}
        }catch (error){
            throw new Error(`Error al guardar elemento: ${error}`)
        }
    }

    async getAll(){
        try{
            const querySnapshot = await this.colection.get()
            const docs = querySnapshot.docs

            const response = []
            docs.map(doc => {
                response.push({id: doc.id, ...doc.data()})
            })

            return response
        }catch (error){
            throw new Error(`Error al guardar elemento: ${error}`)
        }
    }

    async getById(id){
        try{
            const doc = await this.colection.doc(id).get()
            if(!doc.exists){
                throw new Error('Error al buscar: no se encuentra el id')
            }else{
                const response = {...doc.data(), id}
                return response
            }
        }catch (error){
            throw new Error(`Error al guardar elemento: ${error}`)
        }
    }

    async update(obj, id){
        try{
            await this.colection.doc(id).set(obj)
            return 'Elemento actualizado' 
        }catch (error){
            throw new Error(`Error al guardar elemento: ${error}`)
        }
    }

    async deleteAll(){
        try{
            const querySnapshot = await this.colection.get()
            querySnapshot.forEach(e => {
                e.ref.delete()
            })
            return 'Se borraron todos los elementos'
        }catch (error){
            throw new Error(`Error al guardar elemento: ${error}`)
        }
    }

    async deleteById(id){
        try{
            await this.colection.doc(id).delete()
            return 'Elemento borrado'
        }catch (error){
            throw new Error(`Error al guardar elemento: ${error}`)
        }
    }

}

export default Contenedorfirebase