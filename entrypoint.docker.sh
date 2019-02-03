#!/bin/bash
ln -sf /data/kvstore.db $HOME
ln -sf /data/kvstore.secret $HOME
cd /app
ls
forever app.js