import ProductModel from "../models/product.model.js";
import { UploadFile } from "../services/storage.service.js";


export const CreateProduct = async (req, res) => {
    try {
        const { Title, Description, PriceAmount, PriceCurrency } = req.body;
        const seller = req.user
        const images = await Promise.all(req.files.map(async (file) => {
            return await UploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            });
        }));

        const product = await ProductModel.create({
            Title,
            Description,
            Price: {
                Amount: Number(PriceAmount),
                Currency: PriceCurrency || 'INR'
            },
            images,
            Seller: seller._id
        });

        res.status(201).json({
            message: "product created successfully",
            success: true,
            product
        });


    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
            message: error.message
        })
    }
}

export const GetAllSellerProducts = async (req, res) => {
    try {
        const seller = req.user;

        const products = await ProductModel.find({
            Seller: seller._id
        })
        if (!products) {
            return res.status(404).json({
                message: "no products found",
                success: false
            })
        }
        return res.status(200).json({
            message: "products fetched successfully",
            success: true,
            products
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: error.message
        })
    }
}


export async function GetAllProducts(req, res) {
    try {
        const products = await ProductModel.find();
        res.status(200).json({
            message: 'products fetched successfully ',
            success: true,
            products
        })
    }
    catch {
        return res.status(500).json({
            message: error.message
        })
    }
}


export async function GetProductById(req, res) {
    try {
        const { id } = req.params
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: 'product not found ',
                success: false
            })
        }
        res.status(200).json({
            message: 'product detail fetched successfully ',
            success:true,
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}