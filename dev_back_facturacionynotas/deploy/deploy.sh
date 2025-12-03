#!/bin/bash
pwd
#Docker create Network
docker network create docker_default
docker-compose -pfacturacionnotas-back up --build --force-recreate -d --remove-orphans
