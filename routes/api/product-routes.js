const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// gets all products and includes their category and tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag }
      ]
    });
    if(!products) {
      res.status(404).json({ message: 'No products found!' });
      return;
    }
    res.json(products); 
  } catch(err) {
    res.status(500).json(err);
  }
});

// gets one product by id and includes its category and tag data
router.get('/:id', async (req, res) => {
  try{
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },  
        { model: Tag }
      ]
    });
    if (!product) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    } 
    res.status(200).json(product);
  } catch(err) {
    res.status(500).json(err);
  }
});

// create new product and adds tags to product if any are provided
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body);
    console.log(req.body.tagIds);
    if(req.body.tagIds) {
      const tagIdsArr = JSON.parse(req.body.tagIds);
      if (tagIdsArr.length) {
        const productTagIdArr = tagIdsArr.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
        res.status(200).json(productTagIds);
      }
    }
    res.status(200).json(product);
  } catch(err) {
    res.status(400).json(err);
  }
});

// update product and its tags if any are provided
router.put('/:id', async (req, res) => {
  try{
    const product = await Product.update(req.body, {
      where : {
        id: req.params.id,
      },
    });
    if(!product) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    }
    if(req.body.tagIds) {
      const tagIdsArr = JSON.parse(req.body.tagIds);
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = tagIdsArr
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {  
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !tagIdsArr.includes(tag_id))
        .map(({ id }) => id);
      const updatedProductTags = await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]); 
      res.status(200).json(updatedProductTags);
    }
    res.status(200).json(product);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try{
    const product = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!product) {
      res.status(404).json({ message: 'No product found with this id!' });
      return;
    } 
    res.status(200).json(product);
  } catch(err) {
    res.status(500).json(err);
  }

});

module.exports = router;
