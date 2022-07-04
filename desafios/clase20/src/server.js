import express from "express"
const {Router} = express

import { productosDao, carritosDao } from "./daos/index.js"

//Instanciar servidor

const app = express()

//--------------------

//Permiso de Admin
const admin = true

const Admin = (req, res, next) => {
    if (!admin) {
        res.json('Permiso insuficiente')
    } else {
        next()
    }
}
//-----------------

//Router de productos

const productosRouter = new Router()

productosRouter.get('/', async (req, res) => {
    res.json(await productosDao.getAll())
})
productosRouter.get('/:id', async (req, res) => {
    res.json(await productosDao.getById(req.params.id))
})

productosRouter.post('/', Admin, async (req, res) => {
    res.json(await productosDao.save(req.body))
})

productosRouter.put('/:id', Admin, async (req, res) => {
    res.json(await productosDao.update(req.body, req.params.id))
})

productosRouter.delete('/', Admin, async (req, res) => {
    res.json(await productosDao.deleteAll())
})
productosRouter.delete('/:id', Admin, async (req, res) => {
    res.json(await productosDao.deleteById(req.params.id))
})

//-------------------

//Router de carritos

const carritosRouter = new Router()

carritosRouter.get('/', async (req, res) => {
    res.json(await carritosDao.getAll())
})
carritosRouter.get('/:id', async (req, res) => {
    res.json(await carritosDao.getById(req.params.id))
})

carritosRouter.post('/', async (req, res) => {
    res.json(await carritosDao.save(req.body))
})

carritosRouter.put('/:id', async (req, res) => {
    res.json(await carritosDao.update(req.body, req.params.id))
})

carritosRouter.delete('/', async (req, res) => {
    res.json(await carritosDao.deleteAll())
})
carritosRouter.delete('/:id', async (req, res) => {
    res.json(await carritosDao.deleteById(req.params.id))
})

//------------------

//Router de productos en carritos

carritosRouter.get('/:id/products', async (req, res) => {
    const carrito = await carritosDao.getById(req.params.id)
    res.json(carrito.productos)
})

carritosRouter.post('/:id/products/:idProd', async (req, res) => {
    const carrito = await carritosDao.getById(req.params.id)
    const producto = await productosDao.getById(req.params.idProd)
    carrito.productos.push(producto)
    await carritosDao.update(carrito, req.params.id)
    res.json('Producto agregado al carrito')
})

carritosRouter.delete('/:id/products/:idProd', async (req, res) => {
    const carrito = await carritosDao.getById(req.params.id)
    const index = carrito.productos.findIndex(e => e.id == req.params.idProd)
    carrito.productos.splice(index, 1)
    await carritosDao.update(carrito, req.params.id)
    res.json('Producto eliminado del carrito')
})

//-------------------------------

//Configuración servidor

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/products', productosRouter)
app.use('/api/carts', carritosRouter)

export default app