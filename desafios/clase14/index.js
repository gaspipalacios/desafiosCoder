const express = require("express")

const app = express()

const PORT = process.env.PORT || 8080

const productsRoute = require("./routes/products.js")
const cartRoute = require("./routes/carts.js")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/api/products", productsRoute)
app.use("/api/carts", cartRoute)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})