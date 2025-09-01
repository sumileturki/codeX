# CodeX 

Welcome to the **CodeX ** project! This is a feature-rich  of the CodeX application, designed to replicate its core functionalities while integrating cutting-edge enhancements.

## 🚀 Features

- **Google Authentication**: Secure user login and authentication with Google.
- **AI Integration**: Powered by the Gemini API for advanced AI-enhanced functionalities.
- **Real-Time Updates**: Leveraging Convex backend for seamless data handling and real-time updates.
- **Scalable Architecture**: Built with Next.js for a responsive, modern, and scalable front end.

## 🛠️ Technology Stack

- **Frontend**: Next.js - A powerful React framework for server-side rendering and static site generation.
- **Backend**: Convex - Real-time data backend for fast and efficient updates.
- **Authentication**: Google OAuth 2.0 for secure user authentication.
- **AI Services**: Gemini API integration for enhanced features.

## 📋 Environment Variables

To set up the application, create a `.env` file in the root directory and include the following variables:

### Google Authentication

```
NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY=
```

### Gemini API Key

```
NEXT_PUBLIC_GEMINI_API_KEY=
```

### Convex Deployment

```
CONVEX_DEPLOYMENT=

```

### Convex URL

```
NEXT_PUBLIC_CONVEX_URL=
```

## ⚙️ Setup and Development

Follow these steps to get the project up and running:

1. ** the Repository**:

   ```
   cd CodeX-
   ```

2. **Install Dependencies**:

   ```
   npm install
   ```

   Or if you're using Yarn:

   ```
   yarn install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and paste the required environment variables.

4. **Run the Development Server**:

   ```
   npx convex dev
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000` to view the app.

## 🧪 Testing

Ensure all features work as expected by running:

```bash
npm test
```

Or with Yarn:

```bash
yarn test
```

## 🚀 Deployment

For deployment:

1. Verify that all environment variables are set up correctly in your hosting environment.
2. Build the application for production:
   ```
   npm run build
   ```
3. Deploy the application to your chosen hosting provider (e.g., Vercel, Netlify, AWS).

## 👥 Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request and provide a detailed description of your changes.

---

