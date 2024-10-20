# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code to the container
COPY . .


# Step 6: Build the application (e.g., for a TypeScript or Next.js project)
RUN npm run build

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Run the production command
CMD ["npm", "run", "start:prod"]
