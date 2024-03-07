const fs = require('fs')

// const filename = `${__dirname}/../assets/Carts.json`

class CartManager {
    #carts
    #path

    static #lastId = 1

    constructor(inputPath){
        this.#path = inputPath
    }

    async initialize(){
        this.#carts = await this.getCarts()
        
    }
    
    #getLastId(){        
        if(this.#carts.length){
            const lastId = this.#carts[this.#carts.length - 1].id
            let collector  = lastId + 1
            return collector
        }
        const id = CartManager.#lastId;
        CartManager.#lastId += 1;
        return id
    }

    
    async addCart(arrayDeObjetos){
        const cart = {
            id : this.#getLastId(),
            products: [arrayDeObjetos]
        }
        
        this.#carts.push(cart)
        await this.#writingFile()
    }

    async #writingFile (){
        const fileContent = JSON.stringify(this.#carts, null, '\t')
        await fs.promises.writeFile(this.#path, fileContent)        
    }


    async getCarts(){
        try{
            const fileContent = await fs.promises.readFile(this.#path, "utf-8")
            const existingCarts = JSON.parse(fileContent)
            
            return existingCarts
            
        } catch (err) {
            return []
        }
    }

    async getCartById(idNum){
        const fileProducts = this.#carts
    
        const searchId = fileProducts.find(e => e.id === idNum);
        return searchId 
    }

}

// ------------> TESTING

// const main = async()=>{
//     const pruebaCarrito = new CartManager(filename)
//     await pruebaCarrito.initialize()

//     await pruebaCarrito.addCart(25)
//     console.log(await pruebaCarrito.getCarts())
// }

// main()

module.exports = CartManager
