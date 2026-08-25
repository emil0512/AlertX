# Stage 1: Build the Vite React Frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build frontend bundle
COPY . .
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production \
    PORT=8080 \
    APP_VERSION=1.0.0

# Install only production dependencies (express)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built frontend assets from builder
COPY --from=builder /app/dist ./dist

# Copy server code
COPY server.js ./

# Ensure permissions work seamlessly with OpenShift arbitrary UIDs (GID 0)
RUN chgrp -R 0 /app && chmod -R g=u /app

# Expose standard application port
EXPOSE 8080

# Run as non-root user (security best practice)
USER 1001

# Healthcheck for container runtimes supporting it
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

# Start AlertX Express server
CMD ["node", "server.js"]
