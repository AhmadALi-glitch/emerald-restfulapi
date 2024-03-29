


# first install nodejs on your machine : https://nodejs.org/en/download
# Make sure you have docker installed on your machine : https://docs.docker.com/engine/install


# install packages for the backend using : npm install
# install prisma CLI (ORM) globally : npm install prisma -g


# compose the docker postgresql database container using : docker compose -f postgres_docker.yml up
- if problems occur when you are trying to install the image . try to change the version of postgresql image defined in the postgres_docker.yml file

# create .env file in the root folder an set :
```
DATABASE_URL="postgres://admin:admin@localhost:5432/postgres"
```

# Run The database migrations : npx prisma migrate dev --name=init

# NOTE : if you have already postgresql installed on your machine please stop the service temporarly until you shutdown the docker container

# run the backend using : npm run dev

# Finnaly make sure it hosts on : localhost:3000

