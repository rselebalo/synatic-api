FROM node:14-alpine AS node

# Builder stage

FROM node AS builder

# Use /app as the CWD
WORKDIR /app            

# Copy package.json and package-lock.json to /app
COPY package*.json ./   

# Install all dependencies
RUN npm i  

# Install pm2 for 
RUN npm install pm2 -g

# Copy the rest of the code
COPY . .                

# Invoke the build script to transpile code to js
RUN npm run build       

# Final stage

FROM builder AS final

# Prepare destination directory and ensure user node owns it
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

# Set CWD
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Switch to user node
USER node

# Install libraries as user node
RUN npm i --only=production

# Copy js files and change ownership to user node
COPY --chown=node:node --from=builder /app/dist ./app

# Open desired port
EXPOSE 4000

# Use js files to run the application
ENTRYPOINT ["node", "./dist/index.js"]  

# FROM node:14-alpine AS builder

# # Create Directory for the Container
# WORKDIR /usr/src/app

# # Only copy the package.json file to work directory
# COPY package.json ./

# # Install all Packages
# RUN npm install

# # Install all Packages
# RUN npm install pm2 -g

# # Copy the rest of the code
# COPY . . 

# # Invoke the build script to transpile code to js
# RUN npm run build

# # Production build
# FROM builder AS production

# # Create Directory for the Container
# WORKDIR /usr/src/app

# # Only copy the package.json file to work directory
# COPY package.json ./

# # Install all Packages
# RUN npm install --only=production

# # Copy package.json and package-lock.json
# COPY package*.json ./

# COPY --from=builder /usr/src/app/dist /usr/src/app/dist

# EXPOSE 4000

# CMD ["pm2-runtime","app.js"]