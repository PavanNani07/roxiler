const Product = require('../models/product');

exports.transactions = async (req, res) => {
  try {
    const { month = "March", search, page = 1, perPage = 10 } = req.query;
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const targetMonth = monthNames.indexOf(month) + 1;
    if (isNaN(targetMonth) || targetMonth < 1 || targetMonth > 12) {
      return res.status(400).json({ error: "Invalid month provided." });
    }

    // Search query
    const searchQuery = {};
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search
      searchQuery.$or = [
        { title: searchRegex },
        { description: searchRegex },
        // Assuming the price field is a string, which is not typical
        // { price: searchRegex }, // Comment this out if price is numeric
      ];
    }

    // Query products instead of transactions
    const products = await Product.find({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, targetMonth],
      },
      ...searchQuery,
    })
      .sort({ dateOfSale: -1 })
      .skip((parseInt(page, 10) - 1) * parseInt(perPage, 10))
      .limit(parseInt(perPage, 10));

    const totalCount = await Product.countDocuments({
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, targetMonth],
      },
      ...searchQuery,
    });

    res.json({
      totalCount,
      page: parseInt(page, 10),
      perPage: parseInt(perPage, 10),
      transactions: products,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Server error" });
  }
};
