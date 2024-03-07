const { Router } = require('express')
const ProductManager = require('../productManager')
const CartManager = require('../cartManager')

const router = Router()

const filenameOfProducts = `${__dirname}/../../assets/Products.json`
const filenameOfCarts = `${__dirname}/../../assets/Carts.json`

const cartManager = new CartManager(filenameOfCarts)

router.post('/', async (req, res) => {
    await cartManager.addCart(req.body)
    res.json(req.body)
})

router.get('/:cid', async (req, res) => {
    try {
        //devuelvo el carrito solicitado segun el id indicado como "param" en el url
        const cart = await cartManager.getCartById(+req.params.cid)

        if (!cart) {
            res.status(404).json({ error: `El carrito ingresado es inexistente: ${+req.params.cid}`})
            return
        }

        res.status(200).json(cart)

    } catch (err) {
        res.status(404).json({ error: `No se encuentra el carrito nro ${+req.params.cid}` })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    
    try{
        //devuelvo el carrito solicitado segun el id indicado como "param" en el url
        const cart = await cartManager.getCartById(+req.params.cid)
        if (!cart) {
            res.status(404).json({ error: `El carrito con el id ingresado es inexistente: ${+req.params.cid}. Por favor crear carrito`})
            return
        }
    
        //valido si el codigo del producto ya lo tengo en ese carrito encontrado
        const existingProductsInCart = cart.products.find(p => p.id === +req.params.pid)
        if(existingProductsInCart){
            existingProductsInCart.quantity += 1 // incremento la cantidad del producto
        } else {
            cart.products.push({product: +req.params.pid, quantity: 1})
        }

    } catch (err){
        res.status(404).json({ error: 'No se puede agregar productos al carrito' })
    }
    
})

const main = async () => {
    await cartManager.initialize()
}

main()


module.exports = router