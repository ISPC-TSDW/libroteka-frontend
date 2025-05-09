# Stage 1
FROM node:slim AS build

WORKDIR /app

RUN npm install -g @angular/cli@17.3.12

COPY ./package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN ng build
# Stage 2
FROM nginx:alpine AS runtime

COPY --from=build /app/dist/libroteka/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]