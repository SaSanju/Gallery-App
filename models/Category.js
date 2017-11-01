const mongoose = require('mongoose');

let childCategorySchema = new mongoose.Schema({
    _id: { type: String },
    categoryname: { type: String }
}, { _id: false });

let categorySchema = new mongoose.Schema({
    categoryname: { type: String },
    parentcategory: { type: String, default: null },
    childcategories: [childCategorySchema]
});

var Category = mongoose.model('categories', categorySchema);
module.exports = Category;

