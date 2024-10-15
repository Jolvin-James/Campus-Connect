// File: backend/seed.js

import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import User from './models/user.model.js';
import Post from './models/post.model.js';
import dotenv from 'dotenv';
import connectMongoDB from './db/connectMongoDB.js';

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
          username: faker.internet.userName(),
          fullName: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(), // Random password, could use hashed for real apps
          profileImg: faker.image.avatar(), // Random avatar URL
          coverImg: faker.image.url(),
          bio: faker.lorem.sentence(),
          link: faker.internet.url(),
          gender: faker.helpers.arrayElement(['male', 'female', 'other']),
          age: faker.number.int({ min: 18, max: 65 }),
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
          user: randomUser._id, // Associate post with random user
          title: faker.lorem.sentence(), // Random title
          text: faker.lorem.paragraphs(), // Random content
          img: faker.image.url(), // Random image URL
          likes: [], // No likes initially
          comments: [], // No comments initially
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
          text: faker.lorem.sentence(),
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