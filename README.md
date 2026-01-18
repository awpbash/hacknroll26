# Cloud Code - Learn Cloud Architecture in LeetCode Style

A project that gamifies cloud architecture learning through drag-and-drop challenges, cost optimization, and competitive leaderboards!

## Project Overview

Arguably the average aspiring software developer today:

![comic_strip.jpg](./asset/comic_strip.jpg)

Ever tried understanding cloud architecture but got lost in the theory without practical exposure? So many possible cloud services, how do I even start? Or how do I know what's best out of the many options? What even is in the cloud? That was us too...

![meme.avif](./asset/meme.avif)

So what better way to learn Cloud Architecture than by feeding our daily desire for gratification through LeetCode style problems! Through our challenges, users can drag and drop cloud components (e.g from AWS, Azure, and GCP) to build solutions that are evaluated based on: 
- **Functionality**: Does it meet the requirements?
- **Cost Efficiency**: Does it meet the budget constraints?
- **Complexity**: Is it over-engineered or optimally simple?
- **Best Practices**: AI-powered evaluation for security and scalability

For the complete noob, we also provide a simple guided course to bring you from zero to at least something for your first project, or for the working world! And it's risk-free with feedback from our AI evaluators.

## Features

- 🏗️ **(Daily) Challenges** - Intuitive drag & drop architecture builder with problem statements
- ☁️ **Multi-Cloud Information** - Up-to-date details about services such as AWS, Azure, and GCP
- 💰 **Cost Estimation** - Real-world pricing for services
- 🤖 **AI Evaluation** - LLM-based feedback using GPT-4
- 🏆 **Leaderboards** - Global rankings to manifest our unavoidable Singaporean competitive side

## Tech Stack

### Backend
- **Node.js** + **Express** - REST API
- **Firebase Firestore** - Database for users, challenges, and submissions
- **JWT** - Password Hashing

### Frontend
- **React 18** UI framework
- **Vercel** - Hosting

### AI Integration
- **OpenAI GPT-5** - Intelligent architecture evaluation

## Setup Instructions

### 1. Clone and Navigate to Project Directory
```bash
cd hacknroll26
```

### 2. Edit .env File with your configuration

### 3. Add your service account key file to the server directory

### 4. Initialize the database & project
```bash
bash setup.sh
```

## Usage Guide

### 1. Register an account
- Navigate to 'https://hnr2026-fe.vercel.app/'
- Create a new account with a username, using your email and a secure password.

### 2. Browse Challenges
- Access challenges either from the home page or the challenges section.
- Filter by difficulty level (Easy, Medium, Hard) or Category.
- Select a challenge and start solving!

### 3. View Results
- See if your solution passed or failed.
- Review cost estimations and efficiency scores.
- Compare your solution across the leaderboard.

### 4. Learn from Scratch
- Follow our guided course to understand cloud architecture basics.
- Complete modules and quizzes to build your knowledge.
