const express = require("express")

const app = express()

const productsRoute = require("./routes/products.js")

app.set("view engine", "pug")
app.set("views", "./views")

//Para poder leer req.body
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Uso de la ruta products
app.use("/api/products", productsRoute)

app.listen(8080, () => {
    console.log("Server running on port 8080");
})