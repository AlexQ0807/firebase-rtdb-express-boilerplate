FROM node:15-buster-slim

# Create app directory
WORKDIR /app

# Copy packages to new directory
COPY package*.json /app/

# Install app dependencies
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Copy files to new directory
COPY . .

# NOTE: Change this to the port you intend to use in deployment
EXPOSE 5000

CMD ["node", "app.js"]