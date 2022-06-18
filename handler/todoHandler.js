const express = require('express');
const Todo = require('../schemas/todoSchema');
const User = require('../schemas/userSchema');
const checkLogin = require('../middlewares/checkLogin');

const router = express.Router();

// GET ALL TODOS
router.get('/all', checkLogin, (req, res) => {
  // console.log(req.username);
  // console.log(req.userId);
  try {
    Todo.find()
      .populate('user', 'name username -_id')
      .select({
        _id: 0,
        __v: 0,
        // Date: 0,
      })
      .exec((err, data) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res
            .status(200)
            .json({ result: data, message: 'Todos fetched successfully!' });
        }
      });
  } catch (error) {
    if (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// GET ACTIVE TODOS SEACH BY INDIVIDUAL LANGUAGE
router.get('/php', async (req, res) => {
  try {
    const todo = new Todo();
    const data = await todo.findByLanguage();
    res.status(200).json({ result: data });
  } catch (error) {
    if (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// GET TODOS WITH JS WORD
router.get('/js', async (req, res) => {
  try {
    const data = await Todo.findByJS();
    res.status(200).json({ result: data });
  } catch (error) {
    if (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// GET TODOS LANGUAGE
router.get('/language', async (req, res) => {
  try {
    const data = await Todo.find().byLanguage('js');
    res.status(200).json({ result: data });
  } catch (error) {
    if (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// GET ACTIVE TODOS
router.get('/active', async (req, res) => {
  try {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({ result: data });
  } catch (error) {
    if (error) {
      res.status(500).json({ errro: error.message });
    }
  }
});

// GET A SINGLE TODO BY ID
router.get('/:id', async (req, res) => {
  await Todo.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res
        .status(200)
        .json({ result: data, message: 'todo fetched successfully!' });
    }
  })
    .clone()
    .catch((err) => {
      console.log(err.message);
    });
});

// POST A TODO
router.post('/', checkLogin, async (req, res) => {
  try {
    const todo = new Todo({
      ...req.body,
      user: req.userId,
    });
    const findTodo = await todo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: findTodo._id,
        },
      }
    );
    res.status(200).json({ message: 'todo inserted successfully!' });
  } catch (error) {
    if (error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// POST MULTIPLE TODOS
router.post('/all', async (req, res) => {
  const todos = req.body;
  await Todo.insertMany(todos, (error) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ message: 'Todos were inserted successfully!' });
    }
  });
});

// PUT A TODO BY ID
router.put('/:id', async (req, res) => {
  await Todo.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { new: true },
    (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res
          .status(200)
          .json({ result: data, message: 'todo updated successfully!' });
      }
    }
  ).clone((error) => {
    console.log(error.message);
  });
});

// DELETE A TODO
router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'todo deleted successfully!' });
    }
  }).clone((err) => {
    console.log(err.message);
  });
});

module.exports = router;
