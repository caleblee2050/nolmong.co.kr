# 놀멍배우멍 (nolmong.co.kr)

정적 웹사이트 소스입니다. Cloud Run(Managed)에 Nginx 컨테이너로 배포합니다.

## 구성
- `index.html`, `styles.css`, `script.js`: 사이트 UI
- `robots.txt`, `sitemap.xml`: SEO
- `Dockerfile`: Nginx Alpine 기반 컨테이너 이미지
- `nginx.conf`: 포트 `8080`에서 정적 파일 서비스, SPA 라우팅 fallback
- `@vite/client`: 로컬 미리보기 시 발생하는 404 로그 소음 제거 스텁 파일
- `.github/workflows/cloud-run.yml`: 수동 트리거(Workflow Dispatch)로 Cloud Run 배포

## 로컬 미리보기
```bash
python3 -m http.server 8000
# 브라우저: http://localhost:8000/
```

## 수동 배포 (gcloud)
사전 요구사항:
- GCP 프로젝트 소유 또는 배포 권한 계정: `caleb@nolmong.co.kr`
- Cloud Run, Artifact Registry API 활성화
- 리전 예시: `asia-northeast3` (서울), 서비스명 예시: `nolmong-web`

```bash
# 로그인
gcloud auth login

# 프로젝트/리전 설정
export PROJECT_ID=your-gcp-project-id
export REGION=asia-northeast3
export SERVICE=nolmong-web
export REPOSITORY=cloud-run

# Artifact Registry에 Docker 인증
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# 레포지토리 생성(최초 1회)
gcloud artifacts repositories create ${REPOSITORY} \
  --repository-format=docker \
  --location=${REGION} \
  --description="Cloud Run images"

# 이미지 빌드/푸시
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${SERVICE}:$(git rev-parse --short HEAD || date +%s)"
docker build -t ${IMAGE} .
docker push ${IMAGE}

# Cloud Run 배포 (포트 8080)
gcloud run deploy ${SERVICE} \
  --image ${IMAGE} \
  --region ${REGION} \
  --platform managed \
  --port 8080 \
  --allow-unauthenticated

# 서비스 URL 확인
gcloud run services describe ${SERVICE} --region ${REGION} --format 'value(status.url)'
```

## GitHub Actions로 배포
리포지토리 Secrets에 아래 값들을 추가하세요:
- `GCP_PROJECT_ID`, `GCP_REGION`, `GCP_SERVICE`, `GCP_AR_REPO`
- `GCP_SA_KEY`: 배포 권한이 있는 서비스 계정 키(JSON)

Actions 탭에서 `Deploy to Cloud Run` 워크플로를 수동 실행하면 빌드/푸시/배포가 진행됩니다.
