const {faker} = require('@faker-js/faker')
faker.locale = 'es'

const prodsFakers = (n) => {
    const productos = []
    for (let i = 1; i < n; i++) {
        const producto = {
            id: i,
            productName: faker.commerce.product(),
            price: '$' + faker.commerce.price(),
            thumbnail: faker.image.fashion()
        }
        productos.push(producto)
    }
    return productos
}
module.exports = prodsFakers