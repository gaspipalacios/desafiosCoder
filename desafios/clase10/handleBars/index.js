const express = require("express")
const { engine } = require("express-handlebars")

const app = express()

const productsRoute = require("./routes/products.js")

app.set("view engine", "hbs")
app.set("views", "./views")

app.engine(
    "hbs",
    engine({
        extname: ".hbs",
        defaultLayout: "main.hbs",
        parcialsDir: __dirname + "views/partials"
    }))

//Para poder leer req.body
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Uso de la ruta products
app.use("/api/products", productsRoute)

app.listen(8080, () => {
    console.log("Server running on port 8080");
})