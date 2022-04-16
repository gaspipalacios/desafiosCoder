const express = require("express")

const app = express()

const productsRoute = require("./routes/products.js")

//Para poder leer req.body
app.use(express.json())

app.use("/api/products", productsRoute)

app.listen(8080, () => {
    console.log("Server running on port 8080");
})