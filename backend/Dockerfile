# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=18.18.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Create the uploads directory and adjust permissions
RUN mkdir -p /usr/src/app/uploads && \
    chmod 777 /usr/src/app/uploads

    
    # Copy the rest of your application
COPY . .

# Adjust permissions for all application files
RUN chmod -R 777 /usr/src/app

# Run the application as a non-root user for better security
RUN chown -R node:node /usr/src/app
USER node

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
CMD npm start
