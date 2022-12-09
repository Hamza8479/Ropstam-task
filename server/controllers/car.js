const Product = require("../models/car");
const slugify = require("slugify");

//create
exports.create = async (req, res) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        // your geerated error
        // res.status(400).send("Create product failed");
        // error generated from the backend
        res.status(400).json({
            err: err.message,
        });
    }
};

// listAll
exports.listAll = async (req, res) => {
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate("category")
        .populate("subs")
        .sort([["createdAt", "desc"]])
        .exec();
    res.json(products);
};

// remove
exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({
            slug: req.params.slug,
        }).exec();
        res.json(deleted);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Product Delete Failed");
    }
};

//read
exports.read = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
        .populate("category")
        .exec();
    res.json(product);
};

// update
exports.update = async (req, res) => {
    try {
        // if you want to update the slug too then do this
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        // if you dont want to update the slug and see the product on same url then do this just skip the if part
        const updated = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        ).exec();
        res.json(updated);
    } catch (err) {
        console.log("Produt update ---->", err);
        // return res.status(400).send("product update failed");
        res.status(400).json({
            err: err.message,
        });
    }
};



// list (for arrivals and best seller with pagination)
exports.list = async (req, res) => {
    // console.table(req.body);
    try {
        // sort = createAt/updatedAt, order = desc/ asc limit = 3
        const { sort, order, page } = req.body;
        const currentPage = page || 1;
        const perPage = 3;
        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate("category")
            .sort([[sort, order]])
            .limit(perPage)
            .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

// products counts to show products in pagination
exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
};

// star rating for product
exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    // if our user is no coming fro firebase then we use req.body.email
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
        (el) => el.postedBy.toString() === user._id.toString() // convert it into string if use triple equal otherwise use double equal
    );

    // if user haven't left ratings yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: { ratings: { star, postedBy: user._id } },
            },
            { new: true }
        ).exec();
        console.log("Rating Added", ratingAdded);
        res.json(ratingAdded);
    } else {
        // if user have already left ratings, update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            },
            { $set: { "ratings.$.star": star } },
            { new: true }
        ).exec();
        console.log("Rating Updated", ratingUpdated);
        res.json(ratingUpdated);
    }
};