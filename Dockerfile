# ---------------------
# 1️⃣ Build Stage
# ---------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first for dependency caching
COPY package*.json ./

# Install all dependencies (including devDeps for TypeScript)
RUN npm install

# Copy the rest of the code
COPY . .

# Compile TypeScript -> JavaScript
RUN npm run build

# ---------------------
# 2️⃣ Production Stage
# ---------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only necessary files from builder
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled output
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 8080
ENV NODE_ENV=production
ENV PORT=8080

# Start the app (ESM-compatible)
CMD ["node", "build/src/index.ts"]


