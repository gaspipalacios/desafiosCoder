const fs = require("fs")

let countContenedor = 1

class Contenedor {

    constructor(name) {
        this.name = name,
            this.product = []
    }

    save(obj) {
        countContenedor++;

        let objBis = { id: countContenedor }
        let finalObj = { ...objBis, ...obj };

        if(countContenedor <= 1){
            fs.writeFile(`./${this.name}`, `[${JSON.stringify(finalObj)}]`, 'utf-8', err => {
                err ?
                    console.log("Error al crear archivo")
                    :
                    console.log("Archivo creado, producto creado");
            })

            this.product.push(finalObj)
        }else{
            fs.readFile(`./${this.name}`, 'utf-8', (err, data) => {
                if(err){
                    console.log(err)
                }else{
                    let product = JSON.parse(data)
                    product.push(finalObj)

                fs.writeFile(`./${this.name}`, JSON.stringify(product), 'utf-8', err => {
                    if(err){
                        console.log(err)
                    }else{
                        console.log('Producto agregado')
                        console.log(product);
                    }
                })
                }
            })
        }
    }

    getAll(){
        fs.readFile(`./${this.name}`, 'utf-8', (err, data) => {
            if(err){
                console.log(err)
            }else{
                console.log(JSON.parse(data))
            }
        })
    }

    getById(id){
        fs.readFile(`./${this.name}`, 'utf-8', (err, data) => {
            if(err){
                console.log(err)
            }else{
                let product = JSON.parse(data).find(e => {
                    return e.id == id
                })
                console.log(product);
            }
                
        })
    }

    deleteById(id){
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
    }

    deleteAll(){
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
    }
}

let contenedor1 = new Contenedor("productos.json")

contenedor1.save({ productName: 'Notebook', price: 250000, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png' })
//contenedor1.getAll()
//contenedor1.getById(1)
//contenedor1.deleteById(1)
//contenedor1.deleteAll()