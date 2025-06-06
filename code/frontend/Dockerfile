# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app using NGINX
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 443 for HTTPS
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
