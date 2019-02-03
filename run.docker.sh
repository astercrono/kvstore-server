#!/bin/bash
docker run -d -v $(pwd)/data:/data -p 8081:8080 -t kvstore_server