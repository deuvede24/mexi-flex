import Comment from '../models/commentModel.js';
import { validationResult } from 'express-validator';

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (comment) {
      res.status(200).json({ comment });
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content, user_id, recipe_id } = req.body;
    const newComment = await Comment.create({ content, user_id, recipe_id });
    res.status(201).json({ newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByPk(id);
    if (comment) {
      comment.content = content;
      await comment.save();
      res.status(200).json({ comment });
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Comment.destroy({ where: { id_comment: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Comment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
