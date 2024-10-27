# Specify the base image (Node.js in this case)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /index

# Copy package.json and package-lock.json (if using)
COPY package.json /index

# Install dependencies
RUN npm install

# Copy the rest of your project files
COPY . /index

# Expose the port your application listens on (if applicable)
# EXPOSE 3000

# Define the command to run when the container starts
CMD ["npm", "start"]
