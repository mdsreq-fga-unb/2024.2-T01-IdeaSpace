FROM python:3.11-alpine3.21

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ../api/requirements.txt /app/requirements.txt

RUN pip install --upgrade pip && \
    pip install -r /app/requirements.txt

COPY ../api /app/api

RUN apk add --no-cache bash

CMD ["python", "/app/api/src/main.py"]