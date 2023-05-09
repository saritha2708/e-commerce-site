const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// gets all tags and includes their associated Product data
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product}],
    });
    if(!tagData) {
      res.status(404).json({ message: 'No tags found!' });
      return;
    }
    res.json(tagData);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }

});

// gets one tag by id and includes its associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if(!tagData) {
      res.status(404).json({ message: 'No tags found!' });
      return;
    }
    res.json(tagData);
  } catch(err) {
    res.status(500).json(err);
  }
});

// creates a new tag
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body); 
    res.status(200).json(tagData);
  } catch(err) {
    res.status(400).json(err);
  }
});

// updates a tag's name by its `id` value
router.put('/:id', async (req, res) => {
try {
  const tagData = await Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  if(!tagData) {
    res.status(404).json({ message: 'No tags found!' });
    return;
  }
  res.json(tagData);
} catch(err) {
  res.status(500).json(err);
}
});

// deletes a tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if(!tagData) {
      res.status(404).json({ message: 'No tags found!' });
      return;
    }
    res.json(tagData);
  } catch(err) {
    res.status(500).json(err);
  }
});

module.exports = router;
