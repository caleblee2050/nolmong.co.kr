FROM nginx:alpine

# Copy custom nginx config to listen on Cloud Run default port 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static site files
COPY . /usr/share/nginx/html

# Expose 8080 for Cloud Run
EXPOSE 8080

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
