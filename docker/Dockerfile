FROM python:3.11-alpine3.21

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ../backend/requirements.txt /app/requirements.txt

RUN pip install --upgrade pip && \
    pip install -r /app/requirements.txt

COPY ../backend /app/backend

RUN apk add --no-cache bash

CMD ["fastapi", "dev", "/app/backend/src/main.py", "--reload", "--proxy-headers", "--host", "0.0.0.0", "--port", "8000"]