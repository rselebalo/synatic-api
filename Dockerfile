FROM node:14-alpine AS node

# Builder stage

FROM node AS builder

# Use /app as the CWD
WORKDIR /usr/src/app        

# Copy package.json and package-lock.json to /app
COPY package*.json ./   

# Install all dependencies
RUN npm i  

# Copy the rest of the code
COPY . /usr/src/app                

# Invoke the build script to transpile code to js
RUN npm run build       

# Final stage

FROM builder AS final

# Prepare destination directory and ensure user node owns it
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

# Set CWD
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install libraries as user node
RUN npm i --only=production

# Install pm2 for 
RUN npm install pm2 -g

# Switch to user node
USER node

# Copy js files and change ownership to user node
COPY --chown=node:node --from=builder /usr/src/app/src /usr/src/app

# Open desired port
EXPOSE 4000

# Use js files to run the application
CMD ["pm2-runtime", "/usr/src/app/index.js"] 