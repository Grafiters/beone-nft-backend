# Stage 1: Build the application
FROM node:20.3.1-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Install make and other necessary build tools
RUN apk add --no-cache make gcc g++ python3

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies, including dev dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the project
RUN pnpm build

# Stage 2: Create a lightweight production image
FROM node:20.3.1-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Install make and other necessary build tools
RUN apk add --no-cache make

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/configs.yml ./
COPY --from=builder /app/cra-abi.json ./
COPY --from=builder /app/Makefile ./
COPY --from=builder /app/script ./script
COPY --from=builder /app/src ./src
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/staking_contract ./staking_contract
COPY --from=builder /app/node_modules ./node_modules

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "dist/main"]
