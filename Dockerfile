FROM node:20-alpine
WORKDIR /app
COPY proxy/gateway.js /app/gateway.js
EXPOSE 9090
CMD ["node", "gateway.js"]
