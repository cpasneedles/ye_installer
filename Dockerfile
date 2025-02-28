FROM rust:1.83

# WORKDIR /git_clone

# RUN git clone --branch stable https://github.com/rui314/mold.git \
#     && cd mold \
#     && ./install-build-deps.sh \
#     && cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_CXX_COMPILER=c++ -B build \
#     && cmake --build build -j$(nproc) \
#     && cmake --build build --target install

WORKDIR /app

COPY Cargo.toml Cargo.lock ./
COPY src-tauri/.env ./.env
COPY public public/
COPY src src/
COPY src-tauri src-tauri/

ENV $(cat .env | xargs)

CMD ["npx", "tauri", "dev"]