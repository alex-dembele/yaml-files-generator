# Production Stage - Assuming build is done locally
FROM nginx:1.27.0-alpine
WORKDIR /usr/share/nginx/html

# Install sed for text replacement
RUN apk add --no-cache sed

# Remove default Nginx static files
RUN rm -rf ./*

# Copy local project files from the 'dist' directory
COPY dist/ .

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Expose port 80
EXPOSE 80

# Use the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]

# Start Nginx (this will be executed by the entrypoint script)
CMD ["nginx", "-g", "daemon off;"]