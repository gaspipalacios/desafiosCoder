const knex = require("knex")({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "",
        database: "gpDataBase2"
    },
    pool: {
        min: 2,
        max: 8
    }
})

knex.schema
    .createTableIfNotExists("products", function(table) {
        table.increments("id").primary()
        table.string("productName")
        table.string("price")
        table.string("thumbnail")
    })
    .then(() => {
        console.log("Conexión establecida, tabla creada.")
    })
    .catch((error) => {
        throw(error)
    })

module.exports = knex