# XY-INC
Plataforma que fornece serviço para auxiliar pessoas na localização de ponto de interesse (POIs).
O serviço recebe uma coordenada X e uma coordenada Y, especificando um ponto de referência, bem como uma distância máxima (d-max) em metros. O serviço retorna todos os POIs da base de dados que estejam a uma distância menor ou igual a d-max a partir do ponto de referência.
## Exemplo:
### Base de Dados:
+ 'Lanchonete' (x=27, y=12)
+ 'Posto' (x=31, y=18)
+ 'Joalheria' (x=15, y=12)
+ 'Floricultura' (x=19, y=21)
+ 'Pub' (x=12, y=8)
+ 'Supermercado' (x=23, y=6)
+ 'Churrascaria' (x=28, y=2)

Dado o ponto de referência (x=20, y=10) indicado pelo receptor GPS, e uma distância máxima de 10 metros, o serviço retorna os seguintes POIs:
+ Lanchonete
+ Joalheria
+ Pub
+ Supermercado

### Versão
1.0.0

### Requisitos
- MongoDB >= v3.0.1
- NodeJS >= v4.2.2
- Npm >= v2.14.7

### Instalação

```sh
$ git clone https://github.com/thiagobitencourt/xy-inc
$ cd xy-inc
$ npm start
```
