# VerbaNova Backend Documentation

This is the backend server for the VerbaNova blog platform, built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Image Storage**: ImageKit
- **Environment Variables**: dotenv
- **CORS**: Enabled for cross-origin requests
- **Module System**: ES Modules (ESM)

## Project Structure

```
server/
├── config/         # Configuration files (database connection, etc.)
├── controllers/    # Route controllers
├── middlewares/    # Custom middlewares (auth, file upload)
├── models/         # Mongoose data models
├── routes/         # API route definitions
├── server.js       # Main application entry point
└── package.json    # Project dependencies and scripts
```

## Setup and Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Admin login | No |
| GET | `/comments` | Get all comments | Yes |
| GET | `/blogs` | Get all blogs (admin view) | Yes |
| POST | `/delete-comment` | Delete a comment by ID | Yes |
| POST | `/approve-comment` | Approve a comment by ID | Yes |
| GET | `/dashboard` | Get dashboard statistics | Yes |

### Blog Routes (`/api/blog`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/add` | Add a new blog post (with image upload) | Yes |
| GET | `/all` | Get all published blogs | No |
| GET | `/:blogId` | Get a specific blog post | No |
| POST | `/delete` | Delete a blog post by ID | Yes |
| POST | `/toggle-publish` | Toggle blog post publication status | Yes |
| POST | `/add-comment` | Add a comment to a blog post | No |
| GET | `/comments/:blogId` | Get comments for a blog post | No |
| POST | `/generate` | Generate blog content using AI | Yes |

## Data Models

### Blog Model
```javascript
{
  title: { type: String, required: true },
  subTitle: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  isPublished: { type: Boolean, required: true },
  timestamps: true      // createdAt, updatedAt
}
```

### Comment Model
```javascript
{
  blog: { type: ObjectId, ref: "blog", required: true },
  name: { type: String, required: true },
  content: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  timestamps: true      // createdAt, updatedAt
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the request header:

```
Authorization: Bearer <token>
```

## File Upload

Blog images are handled using Multer middleware and stored in ImageKit. The image upload endpoint (`/api/blog/add`) expects a multipart form data with an "image" field. The image field is required for blog creation.

## Error Handling

The API implements standard HTTP status codes and returns JSON responses with appropriate error messages when exceptions occur.

## Security

- CORS is enabled for cross-origin requests
- JWT authentication for protected routes
- Environment variables for sensitive data
- Input validation and sanitization
- Comment approval system for moderation
