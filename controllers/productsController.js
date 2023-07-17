const product_model = require("../schemas/productsSchema").products;
const { Parser } = require("json2csv");
const { ObjectId } = require("mongodb");

exports.getProducts = async (req, res, next) => {
  try {
    const { sellerid, storeid } = req.query;

    let query = { sellerId: sellerid };

    if (storeid) {
      query.storeId = storeid;
    }

    const products = await product_model.find(query);

    if (products.length > 0) {
      res.json({ success: true, products });
    } else {
      res.json({ success: false, message: "No products found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.exportProducts = async (req, res, next) => {
  try {
    const { sellerid, storeid } = req.query;

    let query = { sellerId: sellerid };

    if (storeid) {
      query.storeId = storeid;
    }

    const products = await product_model.find(query);

    function formatStockDate(isoTimestamp) {
      const date = new Date(isoTimestamp);
      const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      });

      return formattedDate;
    }
    const flattenedData = products.map((item) => ({
      _id: item._id,
      orderId: item.orderId,
      image: item.image,
      name: item.name,
      phone: item.phone,
      address: item.address,
      district: item.district,
      products: item.products,
      quantity: item.quantity,
      courier: item.courier,
      deliveryCharge: item.deliveryCharge,
      timestamp: formatStockDate(item.timestamp),
    }));
    const filename = "customer_list.csv";

    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(flattenedData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    if (products.length > 0) {
      res.send(csvData);
    } else {
      res.json({ success: false, message: "No customers found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.searchProduct = async (req, res, next) => {
  try {
    const { name, sellerid } = req.query;
    let searchQuery = { name: { $regex: name, $options: "i" } };

    if (sellerid) {
      searchQuery.sellerId = sellerid;
    }

    const pipeline = [
      {
        $match: searchQuery,
      },
      {
        $limit: 50, // Limit the number of search results
      },
    ];

    const products = await product_model.aggregate(pipeline).toArray();

    if (products.length > 0) {
      res.json({ success: true, products });
    } else {
      res.json({ success: false, message: "No products found" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const {
      image,
      name,
      description,
      brand,
      supplier,
      country,
      store,
      liftPrice,
      salePrice,
      qty,
      sellerid,
      supplierid,
      storeid,
    } = req.body;

    const product = new product_model({
      image,
      name,
      description,
      brand,
      sellerId: sellerid,
      supplier,
      supplierId: supplierid,
      country,
      store,
      storeId: storeid,
      liftPrice,
      salePrice,
      qty,
      availableQty: qty,
      timestamp: new Date(),
    });

    const result = await product.save();

    if (result) {
      res.json({ success: true, message: "Product created successfully" });
    } else {
      res.json({ success: false, message: "Product creation failed" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const {
      image,
      name,
      description,
      brand,
      supplier,
      country,
      store,
      liftPrice,
      salePrice,
      qty,
      availableQty,
    } = req.body;

    const product = await product_model.findById(req.query.id);

    if (product) {
      product.image = image || product.image;
      product.name = name || product.name;
      product.description = description || product.description;
      product.brand = brand || product.brand;
      product.supplier = supplier || product.supplier;
      product.country = country || product.country;
      product.store = store || product.store;
      product.liftPrice = liftPrice || product.liftPrice;
      product.salePrice = salePrice || product.salePrice;
      product.qty = qty || product.qty;
      product.availableQty = availableQty || product.availableQty;

      const result = await product.save();

      if (result) {
        res.json({ success: true, message: "Product updated successfully" });
      } else {
        res.json({ success: false, message: "Product updation failed" });
      }
    } else {
      res.json({ success: false, message: "Product updation failed" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};

exports.updateProductQty = async (req, res, next) => {
  try {
    const productIds = req.body.productIds; // Array of product IDs
    const availableQtyIncrements = req.body.availableQtyIncrements; // Array of availableQty increments

    if (productIds.length !== availableQtyIncrements.length) {
      return res.status(400).json({
        success: false,
        message:
          "Number of product IDs and availableQty increments do not match",
      });
    }

    const updates = productIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $inc: { availableQty: availableQtyIncrements[index] } },
      },
    }));

    // Update the products with the provided product IDs
    const result = await productsCollection.bulkWrite(updates);

    if (result.modifiedCount > 0) {
      res.json({ success: true, message: "Products updated successfully" });
    } else {
      res.status(404).json({ success: false, message: "Products not found" });
    }
  } catch (error) {
    console.error("Error updating products:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.decrementProductQty = async (req, res, next) => {
  try {
    const { allProducts } = req.body;

    console.log(allProducts);

    const updatePromises = allProducts.map(async (product) => {
      const updatedProduct = await product_model.findByIdAndUpdate(
        product._id,
        { $inc: { availableQty: -product.quantity } },
        { new: true }
      );
      return updatedProduct;
    });

    console.log(updatePromises);

    await Promise.all(updatePromises);

    res.json({ success: true, message: "Stock updated successfully" });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.query.id;
    const product = await product_model.findById(productId);
    if (product) {
      await product.remove();
      res.json({ success: true, message: "Product deleted successfully" });
    } else {
      res.json({ success: false, message: "Product deletion failed" });
    }
  } catch (exception) {
    console.error("Exception occurred:", exception);
    res.status(500).send(exception);
  }
};
