import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';

dotenv.config();

const categories = [
  { name: 'Technology', slug: 'technology', description: 'Tech news, coding, software development' },
  { name: 'Business', slug: 'business', description: 'Business insights, entrepreneurship, startups' },
  { name: 'Lifestyle', slug: 'lifestyle', description: 'Daily life, personal development, wellness' },
  { name: 'Travel', slug: 'travel', description: 'Travel stories, destinations, adventures' },
  { name: 'Food', slug: 'food', description: 'Recipes, food reviews, culinary experiences' },
  { name: 'Health', slug: 'health', description: 'Health tips, fitness, mental wellness' },
  { name: 'Education', slug: 'education', description: 'Learning, tutorials, educational resources' },
  { name: 'Entertainment', slug: 'entertainment', description: 'Movies, music, shows, celebrity' },
];

const tags = [
  { name: 'javascript', slug: 'javascript' },
  { name: 'react', slug: 'react' },
  { name: 'nodejs', slug: 'nodejs' },
  { name: 'mongodb', slug: 'mongodb' },
  { name: 'web development', slug: 'web-development' },
  { name: 'startup', slug: 'startup' },
  { name: 'productivity', slug: 'productivity' },
  { name: 'travel tips', slug: 'travel-tips' },
  { name: 'healthy living', slug: 'healthy-living' },
  { name: 'cooking', slug: 'cooking' },
  { name: 'tutorial', slug: 'tutorial' },
  { name: 'review', slug: 'review' },
  { name: 'trending', slug: 'trending' },
  { name: 'tips', slug: 'tips' },
  { name: 'news', slug: 'news' },
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Tag.deleteMany({});
    console.log('✓ Cleared existing categories and tags');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✓ Created ${createdCategories.length} categories`);

    // Insert tags
    const createdTags = await Tag.insertMany(tags);
    console.log(`✓ Created ${createdTags.length} tags`);

    console.log('\n✓ Database seeding completed successfully!');
    console.log('\nCategories:');
    createdCategories.forEach(cat => console.log(`  - ${cat.name} (${cat._id})`));
    console.log('\nTags:');
    createdTags.forEach(tag => console.log(`  - ${tag.name} (${tag._id})`));

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
