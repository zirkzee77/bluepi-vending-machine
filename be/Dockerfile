FROM node:18-alpine

RUN apk add --no-cache openssl

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN node -e "const pkg=require('./package.json'); pkg.packageManager='pnpm@9.15.0'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2))"

RUN pnpm install

COPY . .

RUN pnpm db:generate

RUN pnpm build

EXPOSE 5000

CMD ["sh", "-c", "pnpm db:migrate && pnpm db:seed && node dist/main.js"]
