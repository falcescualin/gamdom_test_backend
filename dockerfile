# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install --frozen-lockfile
RUN yarn global add nodemon

# Bundle app source
COPY . .

# Compile TypeScript code
# RUN yarn build

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
# CMD ["node", "dist/index.js"]
CMD ["yarn", "dev"]
