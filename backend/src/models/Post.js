import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [300, 'Summary cannot exceed 300 characters'],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Technology',
      enum: [
        'Technology',
        'Programming',
        'Web Development',
        'Design',
        'AI & ML',
        'Career',
        'Tutorials',
        'General',
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      default: 1, // in minutes
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for comments count
postSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

// Calculate read time and summary before saving
postSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));

    if (!this.summary || this.summary.trim() === '') {
      // Clean simple markdown symbols for summary
      const cleanText = this.content
        .replace(/#+\s/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_`]/g, '')
        .trim();
      this.summary = cleanText.length > 180 ? cleanText.substring(0, 180) + '...' : cleanText;
    }
  }
  next();
});

const Post = mongoose.model('Post', postSchema);
export default Post;
