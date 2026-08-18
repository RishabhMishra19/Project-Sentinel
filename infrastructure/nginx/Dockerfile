FROM nginx:1.27-alpine

# Remove the default nginx configuration.
RUN rm /etc/nginx/conf.d/default.conf

# Add our custom configuration.
COPY infrastructure/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]