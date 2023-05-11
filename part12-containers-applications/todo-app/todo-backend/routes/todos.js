const express = require('express');
const { Todo } = require('../mongo');
const router = express.Router();
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  // increase counter in redis
  await redis.setAsync(
    'todoCounter',
    Number(await redis.getAsync('todoCounter') || 0) + 1
  );

  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  res.send(todo);
});

/* GET amount of added todos  */
router.get('/statistics', async (req, res) => {
  const todoCounter = await redis.getAsync('todoCounter') || 0;
  res.json({ "added todos": todoCounter })
})

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.status(200).send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.todo.id },
      {
        text: req.body.text,
        done: req.body.done
      }
    );
    if (updatedTodo) {
      return res.status(200).json(updatedTodo);
    } else {
      return res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
  }
});

router.use('/:id', findByIdMiddleware, singleRouter)




module.exports = router;
