#!/bin/bash
folderName=$(basename "$PWD")
echo "---- STOP CONTAINER ----"
docker-compose stop

