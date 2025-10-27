# EduFluxAI Deployment Guide

This guide provides instructions on how to deploy the EduFluxAI application to two popular platforms: Google Cloud Run and Vercel.

**IMPORTANT SECURITY NOTE:** This application is designed to use a Gemini API key directly on the frontend. Exposing your API key in client-side code is a significant security risk and is strongly discouraged for production environments. Anyone who visits your website can view your API key and use it, potentially leading to unexpected charges.

For a production-ready application, you should implement a backend proxy that securely stores the API key and forwards requests to the Gemini API. This guide will provide methods to inject the key at build time, which is more secure than hardcoding it but does not eliminate the risk of client-side exposure.

---

## Preparing for Deployment

The current application is set up for simple local execution. To deploy it to a production environment like Cloud Run or Vercel, we need to add a standard build process. This involves packaging the code and assets into optimized static files that can be served efficiently.

### 1. Project Setup (`package.json` & Vite)

Your project needs a `package.json` file to manage dependencies and define build scripts. If you don't have one, create it by running `npm init -y` in your project root. Then, install the necessary libraries:

```bash
# Install production dependencies
npm install react react-dom @google/genai

# Install development dependencies for building
npm install -D typescript @types/react @types/react-dom vite @vitejs/plugin-react
```

Next, add a `build` script to your `package.json`:

```json
// In package.json
"scripts": {
  "build": "vite build"
},
```
You will also need a `vite.config.ts` file in your root directory. A basic configuration would look like this:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### 2. Handling the API Key (Crucial for Security & Functionality)

The current method of setting the API key in `index.html` is insecure and incompatible with build tools. The recommended approach is to use environment variables.

**A. Modify the Code to Read Environment Variables:**

Update `server/aiService.ts` to read the key from `import.meta.env`, which is how Vite exposes environment variables.

*Replace the existing `ai` initialization in `server/aiService.ts` with this:*
```typescript
import { GoogleGenAI /* ...other imports */ } from "@google/genai";
// ... other code

let ai: GoogleGenAI;
try {
    // Vite exposes env variables prefixed with VITE_ on `import.meta.env`
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
        throw new Error("VITE_GEMINI_API_KEY is not set in the environment. Please configure it in your deployment platform.");
    }
    ai = new GoogleGenAI({ apiKey });
} catch (error) {
    console.error("Failed to initialize GoogleGenAI.", error);
    // This will now correctly throw an error if the key isn't set.
}
```

**B. Remove the Hardcoded Key:**

Delete the `<script>` block that defines `window.process` from your `index.html` file.

With these changes, your application is now ready for a standard, secure deployment process.

---

## Method 1: Deploying to Google Cloud Run

Cloud Run is a managed platform that enables you to run stateless containers. We will containerize the application using Docker and serve it with Nginx.

### Step 1: Create a Dockerfile

Create a file named `Dockerfile` in the root of your project with the following content:

```Dockerfile
# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Set the API key as a build-time argument
ARG VITE_GEMINI_API_KEY
# Build the application
RUN VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY} npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx welcome page
RUN rm -rf ./*

# Copy the build output from the build stage
COPY --from=build /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create an Nginx Configuration

Create a file named `nginx.conf` in your project root. This file tells Nginx how to serve your single-page application.

```nginx
server {
  listen 80;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Step 3: Build and Deploy

1.  **Enable Google Cloud Services:**
    Make sure you have a Google Cloud project and have enabled the Cloud Run, Cloud Build, and Artifact Registry APIs.

2.  **Authenticate with gcloud CLI:**
    ```bash
    gcloud auth login
    gcloud config set project YOUR_PROJECT_ID
    ```

3.  **Get your Gemini API Key:**
    Store your key securely. We will pass it during the build process.

4.  **Build and Deploy with Cloud Build:**
    This single command will use Cloud Build to create the Docker image, push it to Artifact Registry, and deploy it to Cloud Run.

    ```bash
    gcloud run deploy edufluxai-app \
      --source . \
      --platform managed \
      --region YOUR_REGION \
      --allow-unauthenticated \
      --set-build-env-vars=VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```
    Replace `YOUR_PROJECT_ID`, `YOUR_REGION`, and `YOUR_GEMINI_API_KEY` with your actual values.

Your application will now be live at the URL provided by Cloud Run.

---

## Method 2: Deploying to Vercel via GitHub

Vercel offers a seamless deployment experience for frontend projects, especially when linked to a GitHub repository.

### Step 1: Push Your Code to GitHub

1.  Create a new repository on [GitHub](https://github.com).
2.  Initialize a git repository in your local project folder and push your code:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```

### Step 2: Create a Vercel Project

1.  Sign up for a [Vercel](https://vercel.com/) account (you can use your GitHub account).
2.  From your Vercel dashboard, click "Add New... > Project".
3.  Import the GitHub repository you just created.

### Step 3: Configure Your Project in Vercel

1.  Vercel should automatically detect your project as a Vite application. If not, set the **Framework Preset** to `Vite`.
2.  The **Build Command** should be `vite build`.
3.  The **Output Directory** should be `dist`.
4.  Navigate to the **Environment Variables** section. Add a new variable:
    *   **Name:** `VITE_GEMINI_API_KEY`
    *   **Value:** Paste your actual Gemini API key.
5.  Click **Deploy**.

Vercel will build and deploy your site. Any future pushes to your `main` branch on GitHub will automatically trigger a new deployment.
