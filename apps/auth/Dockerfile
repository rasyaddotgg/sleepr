## BUILD NYA PAKE WSL YA, KALAU PAKE DOCKER BUILD -T ... NYA GAK JALAN
FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
# Copy prisma schema
COPY apps/auth/prisma ./prisma

RUN npm install -g pnpm

RUN pnpm install

# generate prisma client
RUN pnpm prisma generate

COPY apps/auth apps/auth
COPY libs libs

RUN pnpm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["pnpm", "run", "start:prod", "dist/apps/auth/src/main"]