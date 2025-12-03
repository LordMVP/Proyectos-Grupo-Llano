#!/bin/bash
pwd
#Docker create Network
docker network create docker_default
docker-compose -phomafo-back up --build --force-recreate -d --remove-orphans
