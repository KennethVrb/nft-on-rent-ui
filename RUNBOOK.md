# How to run

## Steps

1. Build and publish docker image to Google Container Registry 

```bash
gcloud builds submit --config .docker/cloudbuild.yaml
```

2. Deploy to Google Cloud Run

```bash
gcloud run deploy pallet-rent-character-loadout \
--image=gcr.io/hack-at-the-edge/pallet-rent-character-loadout@sha256:$DOCKER_IMAGE_HASH \
--allow-unauthenticated \
--timeout=3600 \
--cpu=2 \
--memory=8Gi \
--min-instances=1 \
--max-instances=1 \
--region=europe-west1 \
--project=hack-at-the-edge
```