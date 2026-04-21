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
        // .lean() returns a plain JS object — Mongoose Maps become plain objects,
        // which prevents serialization quirks on the frontend.
        const product = await ProductModel.findById(id).lean();

        if (!product) {
            return res.status(404).json({
                message: 'product not found ',
                success: false
            })
        }
        res.status(200).json({
            message: 'product detail fetched successfully ',
            success: true,
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export async function CreateVariants(req, res) {
    try {
        const { productId } = req.params;
        const { stock, priceAmount, priceCurrency, attributes } = req.body;

        const product = await ProductModel.findOne({
            _id: productId,
            Seller: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                message: 'product not found',
                success: false
            });
        }

        // Upload images if any
        let images = [];
        if (req.files && req.files.length > 0) {
            images = await Promise.all(req.files.map(async (file) => {
                return await UploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                });
            }));
        }

        // Parse attributes if they come as a string (FormData limitation)
        let parsedAttributes = attributes;
        if (typeof attributes === 'string') {
            try {
                parsedAttributes = JSON.parse(attributes);
            } catch (e) {
                console.error("Error parsing attributes", e);
                parsedAttributes = {};
            }
        }

        const newVariant = {
            Images: images,
            stock: Number(stock) || 0,
            price: {
                Amount: Number(priceAmount) || product.Price[0].Amount,
                Currency: priceCurrency || 'INR'
            },
            Attributes: parsedAttributes || {}
        };

        // Append the new variant
        product.Variants.push(newVariant);
        await product.save();

        res.status(200).json({
            message: 'variant added successfully',
            success: true,
            product
        });
    } catch (error) {
        console.error("Error in CreateVariants:", error);
        return res.status(500).json({
            message: error.message
        });
    }
}
export const GetRecommendations = async (req, res) => {
    try {
        const { productId } = req.params;
        const currentProduct = await ProductModel.findById(productId).lean();

        if (!currentProduct) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        const title = currentProduct.Title || "";
        const firstWord = title.trim().split(" ")[0] || "";
        const price = Number(currentProduct.Price?.[0]?.Amount || 0);

        let recommendations = await ProductModel.find({
            _id: { $ne: productId },
            ...(firstWord
                ? { Title: { $regex: firstWord, $options: "i" } }
                : {}),
            ...(price > 0
                ? {
                    Price: {
                        $elemMatch: {
                            Amount: { $gte: price * 0.5, $lte: price * 1.5 }
                        }
                    }
                }
                : {})
        })
            .select("Title images Price")
            .limit(10)
            .lean();

        // Fallback: if strict match returns nothing, still return products.
        if (!recommendations.length) {
            recommendations = await ProductModel.find({
                _id: { $ne: productId }
            })
                .select("Title images Price")
                .sort({ createdAt: -1 })
                .limit(10)
                .lean();
        }

        return res.status(200).json(recommendations);
    } catch (error) {
        return res.status(500).json({
            message: "Recommendation failed",
            success: false
        });
    }
}