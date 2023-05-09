const router = require('express').Router();
const { Category, Product } = require('../../models');

// gets all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product }],
    });
    if(!categories) {
      res.status(404).json({ message: 'No categories found!' });
      return;
    }
    res.json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// gets one category by id
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    }); 
    if (!category) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
     
});

// creates a new category
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(200).json(category);  
  } catch (err) {
    res.status(500).json(err);
  }
});

// updates a category by id
router.put('/:id', async(req, res) => {
  try {
    const category = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },  
    });
    if (!category[0]) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    } 
    //const updatedCategory = await Category.findByPk(req.params.id);
    res.json(category);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// deletes a category by id
router.delete('/:id', async(req, res) => {
  try {
    const category = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!category) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }   
    res.json(category);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
