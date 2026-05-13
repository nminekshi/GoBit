# GoBit - Intelligent Online Auction Platform

GoBit is a comprehensive online auction platform developed as a Final Year Project (FYP). The platform modernizes traditional online auctions by integrating a Smart Auto-Bid Agent for autonomous bidding, real-time auction management, and an AI-powered Fraud Detection Service to ensure a secure and fair trading environment for all users.

## 🚀 Features

- **Smart Auto-Bid Agent**: An intelligent system that autonomously places bids on matching items based on user-defined criteria and maximum limits, operating in the background.
- **AI-Powered Fraud Detection**: A machine learning microservice that analyzes bidding patterns and user behavior to identify and flag potentially fraudulent activities.
- **Real-Time Bidding**: Live updates and instant bid placements using WebSockets.
- **Comprehensive Auction Management**: Dynamic category filters, robust search, and complete tools for sellers to create and manage their auctions.
- **Secure Authentication**: User authentication and authorization utilizing JWT and bcrypt.
- **Modern User Interface**: A responsive, dynamic, and premium frontend built with Next.js and Tailwind CSS.

## 💻 Tech Stack

The project is built using a microservices-oriented architecture:

### Frontend
- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Real-time**: Socket.IO Client

### Backend (Main API)
- **Framework**: Node.js, Express.js
- **Language**: JavaScript
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.IO
- **Authentication**: JSON Web Tokens (JWT), bcryptjs

### Fraud Detection Service
- **Framework**: FastAPI, Uvicorn
- **Language**: Python
- **Machine Learning**: Scikit-learn, Pandas, Joblib

## 🛠️ Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18 or higher)
- Python (v3.9 or higher)
- MongoDB (Running locally or via MongoDB Atlas)

### Installation & Setup

Clone the repository and set up each component:

#### 1. Backend Setup

```bash
cd backend
npm install

# Create a .env file based on the example
cp .env.example .env
# Edit .env and configure your MongoDB URI, JWT Secret, etc.

# Start the development server
npm run dev
```

#### 2. Frontend Setup

```bash
cd frontend
npm install

# Start the frontend development server
npm run dev
```

#### 3. Fraud Service Setup

```bash
cd fraud_service

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app:app --reload
```

## 🧪 Testing

- **Backend**: Run `npm test` in the `backend` directory to execute Jest tests.
- **Frontend**: Run `npm test` in the `frontend` directory.

## 📄 Documentation

For detailed technical documentation, system requirements, and use case diagrams, please refer to the final project report documents.

## 🎓 Academic Project

This project was developed as a Final Year Project (FYP).
