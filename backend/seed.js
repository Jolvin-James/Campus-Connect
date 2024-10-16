import mongoose from 'mongoose';
import casual from 'casual';
import User from './models/user.model.js';
import Post from './models/post.model.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
await connectMongoDB();

// Generate Dummy Users and Posts
const generateUsersAndPosts = async () => {
  try {
    // Create 46 users
    const users = [];
    for (let i = 0; i < 46; i++) {
      users.push(
        new User({
          username: casual.username,
          fullName: casual.full_name, // Generates a full name
          email: casual.email,
          password: casual.password, // Random password; consider hashing for production
          profileImg: casual.avatar, // Random avatar URL
          coverImg: casual.image, // Random image URL
          bio: casual.sentences(1)[0], // Bio in English (first sentence)
          link: casual.url,
          gender: casual.random_element(['male', 'female', 'other']),
          age: casual.integer(18, 65), // Random age between 18 and 65
          followers: [],
          following: [],
          likedPosts: []
        })
      );
    }

    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    // Create 100 posts
    const posts = [];
    for (let i = 0; i < 100; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      posts.push(
        new Post({
          user: randomUser._id,
          title: casual.title, // Random title in English
          text: casual.sentences(3).join(' '), // Content in English with 3 sentences
          img: casual.image,
          likes: [],
          comments: [],
        })
      );
    }

    const createdPosts = await Post.insertMany(posts);
    console.log(`${createdPosts.length} posts created`);

    // Add likes and comments to posts
    for (let post of createdPosts) {
      const numberOfLikes = Math.floor(Math.random() * createdUsers.length);
      const likedUsers = createdUsers.sort(() => 0.5 - Math.random()).slice(0, numberOfLikes);
      post.likes = likedUsers.map(user => user._id);

      const numberOfComments = Math.floor(Math.random() * 10);
      for (let i = 0; i < numberOfComments; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        post.comments.push({
          text: casual.sentence, // Comment text in English
          user: randomUser._id,
        });
      }
      await post.save();
    }

    console.log(`${createdPosts.length} posts updated with likes and comments`);

    // Add liked posts to users
    for (let user of createdUsers) {
      const numberOfLikes = Math.floor(Math.random() * createdPosts.length);
      const likedPosts = createdPosts.sort(() => 0.5 - Math.random()).slice(0, numberOfLikes);
      user.likedPosts = likedPosts.map(post => post._id);
      await user.save();
    }
    
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database seeding completed!');
  }
};

generateUsersAndPosts();