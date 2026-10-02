import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // Create Demo Users
    const alex = await User.create({
      username: 'alexdev',
      email: 'alex@example.com',
      password: 'password123',
      bio: 'Full-stack developer building modern web apps with React and Node.js.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    const sarah = await User.create({
      username: 'sarah_codes',
      email: 'sarah@example.com',
      password: 'password123',
      bio: 'Cloud architect, tech writer, and open-source enthusiast.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    const demoUser = await User.create({
      username: 'demo_user',
      email: 'demo@example.com',
      password: 'password123',
      bio: 'Exploring the new blogging platform and enjoying the interactive features.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    });

    console.log('👤 Created demo users: alexdev, sarah_codes, demo_user');

    // Create Sample Posts with rich Markdown content
    const post1 = await Post.create({
      title: 'Building Modern Full-Stack Applications with MERN in 2026',
      content: `The modern full-stack landscape has matured tremendously over the past few years. While JavaScript and TypeScript remain ubiquitous across the stack, the tools and conventions we use have evolved for greater developer velocity, safety, and performance.

### Why Choose the MERN Stack?

The **MERN** stack (MongoDB, Express, React, Node.js) remains one of the most accessible and versatile architectures for modern web applications.

1. **Unified Language**: Writing JavaScript or TypeScript on both frontend and backend minimizes cognitive context switching.
2. **Schema Flexibility**: MongoDB's document-oriented model allows schemas to evolve naturally alongside product iterations.
3. **Rich Ecosystem**: With thousands of well-maintained packages on npm, you can quickly integrate authentication, markdown parsing, and file storage.

\`\`\`javascript
// Example Express REST API Route
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().populate('author', 'username avatar');
  res.json({ success: true, posts });
});
\`\`\`

### Key Architectural Best Practices

- **Centralized Error Handling**: Use custom error classes and Express error middleware to avoid try/catch boilerplate in every controller.
- **Strict Input Sanitization**: Always validate request payloads before hitting database operations.
- **Component-Driven UI**: Split complex interfaces into reusable, decoupled components.

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

Happy coding and keep building!`,
      summary: 'Explore the modern MERN stack architecture, best practices for RESTful APIs, and how to build scalable full-stack applications in 2026.',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      category: 'Web Development',
      tags: ['React', 'Node.js', 'MongoDB', 'MERN', 'FullStack'],
      author: alex._id,
      likes: [sarah._id, demoUser._id],
      views: 142,
    });

    const post2 = await Post.create({
      title: 'Mastering Markdown for Technical Blogging and Documentation',
      content: `Markdown has become the de facto standard for writing on the web. From GitHub README files to technical documentation and personal blogs, its simplicity and readability make it unbeatable.

### Why Markdown is Essential for Developers

Markdown allows you to focus strictly on content without wrestling with clunky rich-text WYSIWYG editors.

#### Essential Syntax Elements:
- **Headers**: Use \`#\`, \`##\`, \`###\` to structure sections cleanly.
- **Lists**: Ordered and unordered lists for structured thoughts.
- **Code Blocks**: Fenced code blocks with language identifiers give your readers syntax highlighting.
- **Blockquotes**: Great for emphasizing quotations or key takeaways.

#### Sample Code Highlight:
\`\`\`python
def calculate_reading_time(word_count: int, wpm: int = 200) -> int:
    """Estimate article reading time in minutes."""
    return max(1, round(word_count / wpm))
\`\`\`

### Tips for Engaging Tech Writing
1. **Lead with the problem**: Explain *why* your topic matters before jumping into implementation details.
2. **Include working examples**: Test your code snippets before publishing.
3. **Use visuals**: Diagrams, screenshots, and clean typography keep readers engaged.`,
      summary: 'Learn how to leverage Markdown to craft clear, engaging technical blogs and documentation with code snippets, quotes, and lists.',
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      category: 'Programming',
      tags: ['Markdown', 'Writing', 'Documentation', 'DeveloperExperience'],
      author: sarah._id,
      likes: [alex._id],
      views: 98,
    });

    const post3 = await Post.create({
      title: 'Designing Accessible and Beautiful UI with Tailwind CSS',
      content: `Creating responsive, modern user interfaces doesn't have to require hundreds of lines of disjointed CSS classes. **Tailwind CSS** has revolutionized frontend styling with its utility-first approach.

### The Power of Utility Classes

Instead of jumping back and forth between stylesheets and JSX, utility classes allow you to compose designs directly in markup:

\`\`\`jsx
<button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition">
  Publish Post
</button>
\`\`\`

### 3 Tips for Clean Tailwind Code:
1. **Design Tokens**: Standardize colors, typography, and spacing in your \`tailwind.config.js\`.
2. **Component Abstraction**: Don't repeat identical button classes 20 times; create a reusable \`<Button />\` component.
3. **Accessibility (a11y)**: Always maintain sufficient color contrast and include visible focus rings for keyboard navigation.`,
      summary: 'Discover how utility-first CSS with Tailwind empowers developers to rapidly create accessible, responsive, and gorgeous web interfaces.',
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      category: 'Design',
      tags: ['TailwindCSS', 'UI', 'UX', 'Frontend', 'DesignSystems'],
      author: alex._id,
      likes: [sarah._id],
      views: 76,
    });

    console.log('📝 Created 3 sample posts with markdown content and tags');

    // Create Sample Comments
    await Comment.create({
      content: 'Fantastic overview! The separation of concerns between controllers and routes is very clean and easy to follow.',
      post: post1._id,
      author: sarah._id,
    });

    await Comment.create({
      content: 'Thanks Sarah! Really excited to see people building their own custom blogging platforms.',
      post: post1._id,
      author: alex._id,
    });

    await Comment.create({
      content: 'The markdown live preview feature in this blog platform makes writing articles so much smoother!',
      post: post2._id,
      author: demoUser._id,
    });

    console.log('💬 Created sample comments');
    console.log('✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
  }
};

// If run directly via node src/utils/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    await disconnectDB();
    process.exit(0);
  })();
}
