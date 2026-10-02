import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Get comments for a specific post
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'username avatar bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a comment on a post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty',
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = await Comment.create({
      content: content.trim(),
      post: postId,
      author: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'username avatar bio'
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Comment author OR Post author)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Find the associated post to check if current user is post author
    const post = await Post.findById(comment.post);

    const isCommentAuthor =
      comment.author.toString() === req.user._id.toString();
    const isPostAuthor =
      post && post.author.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      deletedId: comment._id,
    });
  } catch (error) {
    next(error);
  }
};
