FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'yarn typeorm:run-migrations' >> /app/start.sh && \
    echo 'if [ ! -f "/app/.seeding_done" ]; then' >> /app/start.sh && \
    echo '    echo "Running seeds for the first time..."' >> /app/start.sh && \
    echo '    yarn seed' >> /app/start.sh && \
    echo '    touch /app/.seeding_done' >> /app/start.sh && \
    echo 'else' >> /app/start.sh && \
    echo '    echo "Seeding already done, skipping..."' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'node dist/src/main.js' >> /app/start.sh

RUN chmod +x /app/start.sh

EXPOSE 3336

CMD ["/bin/sh", "/app/start.sh"]
