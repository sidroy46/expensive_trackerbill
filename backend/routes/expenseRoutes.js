const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  extractExpense,
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');

// Route for uploading image and extracting data
router.post('/extract', upload.single('image'), extractExpense);

// CRUD routes
router.route('/')
  .post(createExpense)
  .get(getExpenses);

router.route('/:id')
  .put(updateExpense)
  .delete(deleteExpense);

module.exports = router;
