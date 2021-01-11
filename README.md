# Development

## 1. Setup

Copy `.env.example` to `.env` and fill in the required environment variables.

## 2. Run

```bash
docker-compose up
```

## 3. Install dependencies

```bash
# First you need to find the id of your container by running
docker container ls

# Run the composer installation in the docker container
docker exec [CONTAINER_ID] bash -c "cd wp-content/ ; composer install"
```

## Autload classes

```bash
docker exec [CONTAINER_ID] bash -c "cd wp-content/ ; composer dumpautoload -o"
```
