# Middleware

## API REST:
![](https://i.imgur.com/You0GWP.jpg)


## RELACIÓN CANAL - USUARIOS:

![](https://i.imgur.com/TRuISAi.jpg)

Un canal contiene el ID del usuario que está suscrito al canal. Por cada usuario que está suscrito, existe una cola de mensajes. Cuando se envía un mensaje a un canal, este mensaje llega a todos los usuarios que están suscritos en ese canal. Por otra parte, existe un hash map con la capacidad de relacionar el canal y su creador con el fin de poder
tener la potestad de borrarlo en caso de querer, puesto que, el creador es el único capaz de borrar el canal.
