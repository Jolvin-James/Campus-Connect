import csv
import random
from faker import Faker

fake = Faker()

# Generate users CSV
def generate_users_csv(filename, num_users=46):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Write the header
        writer.writerow(["username", "fullName", "email", "password", "profileImg", "coverImg", "bio", "link", "gender", "age", "followers", "following", "likedPosts"])
        
        # Write user data
        for i in range(num_users):
            username = f"user_{i+1}"
            fullName = fake.name()
            email = fake.email()
            password = "password123"
            profileImg = fake.image_url()
            coverImg = fake.image_url()
            bio = fake.sentence()
            link = fake.url()
            gender = random.choice(['male', 'female', 'other'])
            age = random.randint(18, 65)
            followers = []
            following = []
            likedPosts = []
            
            writer.writerow([username, fullName, email, password, profileImg, coverImg, bio, link, gender, age, followers, following, likedPosts])

# Generate posts CSV
def generate_posts_csv(filename, num_posts=100, num_users=46):
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Write the header
        writer.writerow(["user", "title", "text", "img", "likes", "comments"])
        
        # Write post data
        for i in range(num_posts):
            user = f"user_{random.randint(1, num_users)}"
            title = fake.sentence()
            text = fake.paragraph()
            img = fake.image_url()
            likes = [f"user_{random.randint(1, num_users)}" for _ in range(random.randint(0, num_users))]
            comments = [
                {
                    "user": f"user_{random.randint(1, num_users)}",
                    "text": fake.sentence()
                }
                for _ in range(random.randint(0, 10))
            ]
            
            writer.writerow([user, title, text, img, likes, comments])

# Generate CSV files
generate_users_csv('campus_connect_users.csv')
generate_posts_csv('campus_connect_posts.csv')