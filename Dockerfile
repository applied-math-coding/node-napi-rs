FROM ubuntu:20.04 as base
RUN apt-get -qq update
# # Get Ubuntu packages
RUN apt-get install -y -q \
    build-essential \
    curl
# # Get Rust; NOTE: using sh for better compatibility with other base images
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
# # Add .cargo/bin to PATH
ENV PATH="/root/.cargo/bin:${PATH}"
# # Check cargo is visible
RUN cargo --help
# # Get Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs
WORKDIR /app
COPY . .

FROM base as rust_build
WORKDIR /app/algorithms
RUN npm i
RUN npm run build

FROM rust_build as node_build
WORKDIR /app
RUN npm i
RUN npm run build

FROM node:16.13.1
WORKDIR /app
COPY --from=node_build /app/dist/ ./dist/
COPY --from=node_build /app/node_modules/ ./node_modules/
COPY --from=node_build /app/prisma/ ./prisma/
COPY --from=node_build /app/.env ./
COPY --from=node_build /app/public/ ./public/
COPY --from=node_build /app/algorithms/algorithms.linux-x64-gnu.node ./algorithms/
COPY --from=node_build /app/algorithms/index.js ./algorithms/
CMD [ "node", "dist/index.js" ]