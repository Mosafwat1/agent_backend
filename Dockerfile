FROM node:18

# Install dependencies required for Chromium
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    libgbm1 \
    libu2f-udev \
    libxshmfence1 \
    libegl1 \
    libwayland-client0 \
    libwayland-cursor0 \
    libwayland-egl1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable to prevent Puppeteer from downloading Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install Chromium
RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*

# Create work directory
WORKDIR /usr/src/app

# Copy app source to work directory
COPY . /usr/src/app

# Install app dependencies
RUN yarn install

# Expose the port the app runs on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start", "serve"]
