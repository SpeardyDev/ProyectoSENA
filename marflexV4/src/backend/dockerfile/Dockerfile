FROM mysql:latest

# Copia tu archivo SQL de respaldo a la carpeta de inicialización de MySQL
COPY bdmarflex.sql /docker-entrypoint-initdb.d/

# Expone el puerto por defecto de MySQL
EXPOSE 3306

# Las variables de entorno se suelen definir en docker-compose.yml
# pero puedes descomentarlas aquí si lo prefieres:
# ENV MYSQL_ROOT_PASSWORD=123456789
# ENV MYSQL_DATABASE=bdmarflex
# ENV MYSQL_USER=root
# ENV MYSQL_PASSWORD=123456789