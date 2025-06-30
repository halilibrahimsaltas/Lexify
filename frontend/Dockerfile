FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build


# Start application
CMD ["npx", "expo", "start", "--tunnel", "--clear"]