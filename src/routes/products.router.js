const { Router} = require('express')
const ProductManager = require('../productManager')

const filenameOfProducts = `${__dirname}/../../assets/Products.json`

const router = Router ()
const productsManager = new ProductManager(filenameOfProducts)


router.get('/', async (req, res) => {
    try {
        //devuelvo el listado de productos si se especifica un limite en la query, sino devuelvo el total de resultados del JSON
        const products = await productsManager.getProducts()
        const limitFilter = req.query.limit

        if(!limitFilter){
            res.status(200).json(products)
            return
        }

        const filteredProducts = products.slice(0, limitFilter)
        res.status(200).json(filteredProducts)

    } catch (err) {
        res.status(404).json({
            error: "Error al obtener listado de productos"
        })
    }
})


router.get('/:pid', async (req,res) => {
    try {
        //devuelvo el producto solicitado segun el id indicado como "param" en el url
        const product = await productsManager.getProductById(+req.params.pid)

        if (!product) {
            res.status(404).json({ error: `El producto ingresado es inexistente: ${+req.params.pid}`})
            return
        }

        res.status(200).json(product)

    } catch (err) {
        res.status(404).json({ error: `No se encuentra el producto en base: ${+req.params.pid}` })
    }
})


router.post('/', async (req, res) => {
    await productsManager.addProduct(
    req.body.title, 
    req.body.description,
    req.body.price,
    req.body.thumbnail,
    req.body.code,
    req.body.stock, 
    req.body.status,
    req.body.category
    )
    
    res.status(200).json(req.body)
})


router.put('/:pid', async (req, res) => {
    try{
            await productsManager.updateProduct(
            +req.params.pid,
            req.body.title, 
            req.body.description,
            req.body.price,
            req.body.thumbnail,
            req.body.code,
            req.body.stock, 
            req.body.status,
            req.body.category
            )
    
        res.status(200).json({status: `El producto ${+req.params.pid} fue modificado correctamente`})

    } catch (err){
        res.status(404).json({error: `Producto nro ${+req.params.pid} a modificar no encontrado o parámetros ingresados son incorrectos`})
    }    
})

router.delete('/:pid', async (req, res) => {
    try {
        const product = +req.params.pid

        if (!product) {
            res.status(404).json({ error: `El producto ingresado es inexistente: ${+req.params.pid}`})
            return
        }
        
        //elimino el producto indicado
        await productsManager.deleteProduct(product)
        res.status(200).json(`El producto ${product} fue eliminado exitosamente`)
        
    } catch (err) {
        res.status(404).json({ error: `No se encuentra el producto en base: ${+req.params.pid}` })
    }
})

const main = async () => {
    await productsManager.initialize()
}

main()

module.exports = router