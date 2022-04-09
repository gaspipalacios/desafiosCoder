//DEFINICIÓN DE VARIABLES Y CONSTANTES
const fs = require("fs")

const express = require("express")
const app = express()

let countContenedor = 4

const PORT = process.env.PORT || 8080

//CREACIÓN DE JSON
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

//let contenedor1 = new Contenedor("productos.json")

//contenedor1.save({ productName: 'Funda laptop', price: 4500, thumbnail: 'link' })

//IMPLEMENTACIÓN DE ENDPOINTS
app.get("/products", (req, res) => {
    fs.readFile("./productos.json", "utf-8", (err, data) => {
        if(err){
            res.send({message: "Error en la consulta"})
        }else{
            const data2 = JSON.parse(data)
            res.send(data2)
        }
    })
})

app.get("/random-product", (req, res) => {
    fs.readFile("./productos.json", "utf-8", (err, data) => {
        if(err){
            res.send({message: "Error en la consulta"})
        }else{
            const dataParse = JSON.parse(data)
            const dataRandom = dataParse[Math.floor(Math.random() * dataParse.length)]
            res.send(dataRandom)
        }
    })
})

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})