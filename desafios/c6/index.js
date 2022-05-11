//DEFINICIÓN DE VARIABLES Y CONSTANTES
const fs = require("fs")

const express = require("express")
const app = express()

const PORT = process.env.PORT || 8080

//CREACIÓN DE ARCHIVO .JSON
const Contenedor = require('../clase4/clase4')

const contenedor1 = new Contenedor("products.json")

//contenedor1.save({ productName: 'Cargador Laptop', price: 3900, thumbnail: 'link' })

//IMPLEMENTACIÓN DE ENDPOINTS
app.get("/products", (req, res) => {
    fs.readFile("./products.json", "utf-8", (err, data) => {
        if(err){
            res.send({message: "Error en la consulta"})
        }else{
            const data2 = JSON.parse(data)
            res.send(data2)
        }
    })
    
})

app.get("/random-product", (req, res) => {
    fs.readFile("./products.json", "utf-8", (err, data) => {
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