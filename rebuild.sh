#!/bin/bash
cd /root/nexmedia/nexclone/NexClone.Backend
while ps -p 262132 > /dev/null; do
    sleep 5
done
cd /root/nexmedia/nexclone
docker compose up -d backend
