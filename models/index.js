// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Category has one-to-many relationship with Product
Product.belongsTo(Category, {});
Category.hasMany(Product, {}); 

// Product has many-to-many relationship with Tag
Product.belongsToMany(Tag, { through: ProductTag }); 
Tag.belongsToMany(Product, { through: ProductTag }); 

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
