import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// @desc    Get all posts with filtering, search, pagination
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      tag,
      author,
      page = 1,
      limit = 9,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Author filter
    if (author) {
      query.author = author;
    }

    // Search filter (title or content)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { content: searchRegex }, { tags: searchRegex }];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'username avatar bio')
      .populate('commentsCount')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'username avatar bio createdAt')
      .populate('commentsCount');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const postObj = post.toObject({ virtuals: true });
    if (req.user) {
      postObj.isLiked = post.likes.some(
        (userId) => userId.toString() === req.user._id.toString()
      );
    } else {
      postObj.isLiked = false;
    }

    res.status(200).json({
      success: true,
      post: postObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { title, content, summary, coverImage, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the post',
      });
    }

    // Process tags (array or comma-separated string)
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const post = await Post.create({
      title,
      content,
      summary,
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      category: category || 'Technology',
      tags: processedTags,
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'username avatar bio'
    );

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (Author only)
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to update this post.',
      });
    }

    const { title, content, summary, coverImage, category, tags } = req.body;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (summary !== undefined) post.summary = summary;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (category !== undefined) post.category = category;

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        post.tags = tags.map((t) => t.trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        post.tags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      'author',
      'username avatar bio'
    );

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post & all associated comments
// @route   DELETE /api/posts/:id
// @access  Private (Author only)
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to delete this post.',
      });
    }

    // Cascade delete comments for this post
    await Comment.deleteMany({ post: post._id });

    // Delete the post
    await Post.findByIdAndDelete(post._id);

    res.status(200).json({
      success: true,
      message: 'Post and its comments deleted successfully',
      deletedId: post._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on post
// @route   POST /api/posts/:id/like
// @access  Private
export const toggleLikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const userIdStr = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userIdStr);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      likesCount: post.likes.length,
      isLiked: !alreadyLiked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct categories and tags for quick filter chips
// @route   GET /api/posts/metadata/categories
// @access  Public
export const getCategoriesAndTags = async (req, res, next) => {
  try {
    const categories = await Post.distinct('category');
    const tags = await Post.distinct('tags');

    res.status(200).json({
      success: true,
      categories,
      tags: tags.slice(0, 15),
    });
  } catch (error) {
    next(error);
  }
};
