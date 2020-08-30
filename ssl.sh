add-apt-repository ppa:certbot/certbot
apt-get update
apt-get install -y certbot

certbot certonly --manual --preferred-challenges=http --manual-auth-hook ./ssl_auth.sh --manual-cleanup-hook ./ssl_cleanup.sh -d nutrition.burnscoding.com

