
docker compose run --rm build
docker compose build web
docker tag clickingbad-web us-west1-docker.pkg.dev/nullism/nullism/clickingbad-web:latest
docker push us-west1-docker.pkg.dev/nullism/nullism/clickingbad-web:latest