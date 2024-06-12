const path = require('path');
const productModel = require('../models/productModel');
const fs = require('fs');


const createProduct = async (req, res) => {
    //1. Check incoming data
    console.log(req.body)
    console.log(req.files)

    //destruction the body data
    const { productName, productPrice, productDescription, productCategory } = req.body;

    //validation of body
    if (!productName || !productPrice || !productDescription || !productCategory) {
        return res.status(400).json({
            "success": false,
            "message": "please enter all the fields"
        })
    }

    //validation of the image
    if (!req.files || !req.files.productImage) {
        return res.status(400).json({
            "success": "false",
            "message": "image not found"
        })
    }
    const { productImage } = req.files;

    //upload image
    //1. generate new image name
    const imageName = `${Date.now()}-${productImage.name}`;

    //2. make an upload path (/path/upload- directory)
    const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

    //3. Move to that directory (await, try-catch)
    try {

        await productImage.mv(imageUploadPath)

        //save to database

        const newProduct = new productModel({
            productName: productName,
            productCategory: productCategory,
            productPrice: productPrice,
            productDescription: productDescription,
            productImage: imageName

        })

        const product = await newProduct.save()

        res.status(201).json({
            "success": true,
            "message": "Product created succsefully",
            "data": product
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })
    }



};

//function to  fetch all products
const getAllProducts = async (req, res) => {

    try {
        const allProducts = await productModel.find({})
        res.status(201).json({
            "success": true,
            "messgae": "Products fetched succesfully",
            "products": allProducts
        }
        )

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": "false",
            "messgae": "internal sefvive error",
            "error": error,
        })

    }

}

//fetch single product
const getSingleProduct = async (req, res) => {
    //get product id from url
    const productId = req.params.id

    try {
        const product = await productModel.findById(productId)

        if (!product) {
            res.status(400).json({
                "success": false,
                "message": "No product found",
            })
        }
        res.status(201).json({
            "success": true,
            "message": "product fetched",
            "product": product
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "messgae": "internal server error",
            "error": error,
        })

    }



}

// delete product

const deleteProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            "success": true,
            "message": "Product deleted successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal server error",
            "error": error
        })

    }
}

//update product
//1. get product id(URL)
//2. if image: 
//3. new image should be upload
//4. old image should be delete
//5. find product ( database)
//6. find that image in directory
//7. delete
//8. update that product

const updateProduct = async (req, res) => {
    try {

        //if there is image
        if (req.files && req.files.productImage) {

            // destructuring
            const { productImage } = req.files;

            //upload image to /public/product folder
            //1. generate new image name
            const imageName = `${Date.now()}-${productImage.name}`;

            //2. make an upload path (/path/upload- directory)
            const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

            //move to folder
            await productImage.mv(imageUploadPath)

            //req.params(id), req.body(updated data), req.files(image)
            // add new field to req.body (productImage -> name)
            req.body.productImage = imageName;

            // if image is uploaded and req.body is assigned
            if (req.body.productImage) {

                ///=finding existing product
                const existingProduct = await productModel.findById(req.params.id)

                //searching in the directory folder
                const oldImagePath = path.join(__dirname, `../public/products/${existingProduct.productImage}`)

                //delete from filesystem
                fs.unlinkSync(oldImagePath)

            }
        }

        //update the data
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).json({
            success: true,
            message: "Product Updated",
            product: updatedProduct
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}




module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct
};;