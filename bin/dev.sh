#!/bin/sh

sh ./bin/env-copy.sh
docker compose up --build --force-recreate --remove-orphans