FROM python:3.11-slim

WORKDIR /worker

COPY worker/requirements.txt ./requirements.txt

COPY worker ./worker

RUN pip install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/app

CMD ["python","-m","worker.main"]