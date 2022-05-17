const express = require("express")

const app = express()

const productsRoute = require("./routes/products.js")

//Para poder leer req.body
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.json())
app.use("/api/products", productsRoute)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.listen(8080, () => {
    console.log("Server running on port 8080");
})