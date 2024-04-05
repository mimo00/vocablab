FROM python:3.10-slim

ENV PYTHONUNBUFFERED 1
ENV PIPENV_NOSPIN 1

RUN apt-get -qq update \
    && python -m pip install  --no-cache-dir pip==24.0 \
    && pip install --no-cache-dir pipenv==2022.4.8 \
    && addgroup --system django \
    && adduser --system --ingroup django django

WORKDIR /app
COPY ./Pipfile ./Pipfile.lock ./
RUN pipenv install --system --dev

COPY ./vocablab /app

RUN chown -R django /app

USER django

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]