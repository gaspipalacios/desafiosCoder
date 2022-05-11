const fs = require("fs")

const express = require("express")

const { Router } = express

let countContenedor = 5
class Contenedor {

    constructor(name) {
        this.name = name,
            this.product = []
    }

    save(req, res) {
        countContenedor++;
        
        let obj = { id: countContenedor }
        let finalObj = { ...obj, ...req.body };

        if(countContenedor <= 1){
            fs.writeFile(`./${this.name}`, `[${JSON.stringify(finalObj)}]`, 'utf-8', err => {
                err ?
                    res.send({message: `Error: ${err}`})
                    :
                    res.send({message: "Archivo creado, producto creado"});
            })

            this.product.push(finalObj)
        }else{
            fs.readFile(`./${this.name}`, 'utf-8', (err, data) => {
                if(err){
                    res.send({message: `Error: ${err}`})
                }else{
                    const product = JSON.parse(data)
                    product.push(finalObj)

                fs.writeFile(`./${this.name}`, JSON.stringify(product), 'utf-8', err => {
                    if(err){
                        res.send({message: `Error: ${err}`})
                    }else{
                        res.send({message: "Producto agregado", data: product})
                    }
                })

                this.product = product
                }
            })
        }
        
    }

    getAll(req, res){
        fs.readFile(`./${this.name}`, "utf-8", (err, data) => {
            if(err){    
                res.send({message: "Error en la consulta"})
            }else{
                const data2 = JSON.parse(data)
                res.send(data2)
            }
        })
    }

    getById(req, res){
        fs.readFile(`./${this.name}`, "utf-8", (err, data) => {
            if(err){
                res.send({message: "Error en la consulta"})
            }else{
                const id = Number(req.params.id)
                const data2 = JSON.parse(data).find(e => {
                    return e.id === id
                })

                if(data2 === undefined){
                    res.send({message: "Producto no encontrado"})
                }else{
                    res.send(data2)
                }
                
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
const contenedor1 = new Contenedor("products.json")

const router = new Router()

//GETs
router.get("/", (req, res) => {
    contenedor1.getAll(req, res)
})

router.get("/:id", (req, res) => {
    contenedor1.getById(req, res)
})

//POSTs
router.post("/", (req, res) => {
    contenedor1.save(req, res)
})

//Exporto router para usar en index.js
module.exports = router
