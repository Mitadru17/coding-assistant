# Coding Interview Question Generator

A full-stack application that uses Google's Gemini API to generate daily coding interview questions and provide detailed explanations.

## Features

- Daily coding interview question generation
- Detailed explanations with step-by-step solution logic
- Python code examples with time and space complexity analysis
- Clean, responsive React frontend

## Project Structure

- `/` - Backend Express server
- `/client` - React frontend application

## Backend Setup

1. Install backend dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the root directory with:
   ```
   HF_API_KEY=your_huggingface_api_key_here
   PORT=3000
   ```
3. Start the backend server:
   ```
   npm start
   ```

## Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```
2. Install frontend dependencies:
   ```
   npm install
   ```
3. Start the frontend development server:
   ```
   npm start
   ```

## API Endpoints

### GET /daily-question

Returns a single coding interview question with difficulty and tags.

**Example Response:**
```json
{
  "question": "Q: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nDifficulty: Easy\nTags: Arrays, Hash Table"
}
```

### POST /explanation

Returns a detailed explanation for a coding interview question.

**Request Body:**
```json
{
  "question": "Q: Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
}
```

**Example Response:**
```json
{
  "explanation": "Step-by-step solution explanation with Python code and complexity analysis..."
}
```

## Development

To run the backend server in development mode with auto-restart:
```
npm run dev
```

## Running the Full Stack Application

1. Start the backend server (from the root directory):
   ```
   npm start
   ```
2. In a separate terminal, start the frontend server:
   ```
   cd client
   npm start
   ```
3. Access the application at `http://localhost:3001`

## Technologies Used

- Backend: Node.js, Express
- Frontend: React
- API: Hugging Face Inference API (Mixtral-8x7B-Instruct)
- HTTP Client: Axios

## Future Improvements

- Add caching to store daily questions
- Add user authentication and tracking of solved questions 