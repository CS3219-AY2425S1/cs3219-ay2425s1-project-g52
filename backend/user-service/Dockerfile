# Runtime environment that has our desired version of Node.js installed
FROM node:20-alpine 

# Working directory in the container
WORKDIR /app

# For Node.js apps, we need to copy package.json and package-lock.json or yarn.lock
# These include dependencies of our app.

COPY package*.json ./

# Run Command to install dependencies of node modules
RUN npm install

# Keep it commented. Uncomment it ONLY IF code is built for production.
# RUN npm ci --omit=dev

# Copy entire source code directory into our working directory of the container
COPY . . 
# Note the space above! The format is 'COPY [source] [dest]'

# Interact with app by Exposing a port number to the outside world
EXPOSE 3001

# Start our app. Command is dependent on tech stacks used
# For React apps, it is `npm start`
CMD ["npm", "start"]

