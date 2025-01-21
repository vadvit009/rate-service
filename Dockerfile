# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Build the TypeScript files (if needed)
RUN npm run build

# Expose the port your NestJS app runs on
EXPOSE 3000

# Default command to start the application
CMD ["npm", "run", "start:prod"]