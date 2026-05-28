# Docker & Nginx

## Dockerfile

Multi-stage 빌드: Node에서 빌드 후 nginx:alpine에 정적 파일만 복사한다.

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## nginx.conf

SPA 라우팅 + `index.html` 캐시 방지를 함께 담당한다.

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**이유:** `index.html`이 캐시되면 새 배포 후에도 구 버전 JS/CSS를 로드한다. JS/CSS는 Vite가 content hash로 파일명을 생성하므로 캐시해도 무방하지만, 진입점인 `index.html`은 반드시 항상 최신본을 받아야 한다.

---

## 빌드 & 푸시 스크립트

`docker-build.sh`를 프로젝트 루트에 둔다.

```bash
#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

VERSION=$(grep '"version"' package.json | head -1 | cut -d'"' -f4)
IMAGE_NAME="<registry>/<image-name>:fe_${VERSION}"

echo "Building Docker image: $IMAGE_NAME"
docker buildx build --no-cache --platform linux/amd64 -t "$IMAGE_NAME" --load .

read -p "Do you want to push the image to the registry? [Y/N]: " PUSH_CONFIRM
if [[ "$PUSH_CONFIRM" =~ ^[Yy]$ ]]; then
    docker login
    echo "Pushing Docker image: $IMAGE_NAME"
    docker push "$IMAGE_NAME"
else
    echo "Skipping docker push."
fi

echo "Done. Image: $IMAGE_NAME"
```

- 이미지 태그는 `package.json`의 `version` 필드를 자동으로 읽는다.
- `--platform linux/amd64`: Mac(ARM)에서 빌드해도 서버용 amd64 이미지를 생성한다.
- `--no-cache`: 항상 클린 빌드. 레이어 캐시로 인한 스테일 빌드를 방지한다.
- 푸시 여부를 대화형으로 확인한다.
