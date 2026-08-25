FROM node:20-alpine

WORKDIR /app

COPY package.json dispatcher-func.js ./

# Run as non-root user for security
RUN chgrp -R 0 /app && chmod -R g=u /app
USER 1001

ENV PORT=8080 NODE_ENV=production
EXPOSE 8080

CMD ["node", "dispatcher-func.js"]
