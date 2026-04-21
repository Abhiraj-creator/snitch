import ProductModel from "../models/product.model.js"

export const Searchproduct = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    if (!q) {
      return res.status(400).json({
        message: "Query is required",
        success: false
      })
    }
    let products;
    if (q.length > 3) {

      products = await ProductModel.find(
        { $text: { $search: q } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .select("Title images Price")
        .limit(20);
    } else {

      products = await ProductModel.find({
        Title: { $regex: q, $options: "i" }
      })
        .select("Title images Price")
        .limit(20);
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: error.message,
      success: false
    })
  }
}