# Api Symfo 

Api avec le framework Symfony associé à un front ReactJs 

## Installation

Installation des dépendances du projet 
```bash
composer install
```

Création de la BDD 
```bash
php bin/console d:d:c
```

Création des tables en BDD (execution des migrations)
```bash
php bin/console d:m:m
```

Création des données en BDD (Faker)
```bash
php bin/console d:f:l
```