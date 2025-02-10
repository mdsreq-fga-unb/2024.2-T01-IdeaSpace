make start:
	docker compose -f docker/compose.yml up

make populate:
	docker compose -f docker/compose.yml exec backend python /app/backend/src/scripts/populate_db.py