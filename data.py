import csv
import random
from faker import Faker
from bson import ObjectId

fake = Faker()

# Read user IDs from CSV
def read_user_ids(filename):
    user_ids = []
    with open(filename, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            user_ids.append(ObjectId(row['_id']))
    return user_ids

# Generate users CSV
def generate_users_csv(filename, num_users=46):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Write the header
        writer.writerow(["_id", "username", "fullName", "password", "email", "gender", "age", "followers", "following", "profileImg", "coverImg", "bio", "link", "likedPosts", "createdAt", "updatedAt"])
        
        # Write user data
        for _ in range(num_users):
            _id = ObjectId()
            username = fake.user_name()
            fullName = fake.name()
            password = fake.password()
            email = fake.email()
            gender = random.choice(['male', 'female', 'other'])
            age = random.randint(18, 65)
            followers = []
            following = []
            profileImg = fake.image_url()
            coverImg = fake.image_url()
            bio = fake.sentence()
            link = fake.url()
            likedPosts = []
            createdAt = fake.iso8601()
            updatedAt = fake.iso8601()
            
            writer.writerow([_id, username, fullName, password, email, gender, age, followers, following, profileImg, coverImg, bio, link, likedPosts, createdAt, updatedAt])

# Generate posts CSV
def generate_posts_csv(filename, user_ids, num_posts=100):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Write the header
        writer.writerow(["_id", "user", "title", "text", "img", "likes", "comments", "createdAt", "updatedAt"])
        
        # Write post data
        for i in range(num_posts):
            _id = ObjectId()
            user = random.choice(user_ids)
            title = fake.sentence()
            text = fake.paragraph()
            img = fake.image_url()
            likes = [ObjectId() for _ in range(random.randint(0, len(user_ids)))]
            comments = [
                {
                    "user": ObjectId(),
                    "text": fake.sentence()
                }
                for _ in range(random.randint(0, 10))
            ]
            createdAt = fake.iso8601()
            updatedAt = fake.iso8601()
            
            writer.writerow([_id, user, title, text, img, likes, comments, createdAt, updatedAt])

# Generate users CSV file
generate_users_csv('campus_connect_users.csv')

# Read user IDs from the generated CSV
user_ids = read_user_ids('campus_connect_users.csv')

# Generate posts CSV file
generate_posts_csv('campus_connect_posts.csv', user_ids)