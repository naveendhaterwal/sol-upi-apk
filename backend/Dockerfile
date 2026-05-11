FROM rust:1.81-slim-bullseye AS builder

WORKDIR /usr/src/app

# Install dependencies required for Prisma and Rust compilation
RUN apt-get update && apt-get install -y openssl libssl-dev pkg-config

# Copy Cargo files
COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY prisma ./prisma

# Generate Prisma Client (This step requires the Prisma schema)
# To avoid Prisma engine download issues during build, we run cargo build which triggers the generation
# based on our prisma-client-rust setup
RUN cargo build --release

FROM debian:bullseye-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/app/target/release/solupi-backend /usr/local/bin/solupi-backend

ENV PORT=3001
EXPOSE 3001

CMD ["solupi-backend"]
