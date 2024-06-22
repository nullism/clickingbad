FROM nginx:alpine-slim

COPY ./docroot/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]