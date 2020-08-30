add-apt-repository ppa:certbot/certbot
apt-get update
apt-get install certbot

certbot certonly --standalone
