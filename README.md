# wiattend-client
Client for wiattend NodeJS server [wiattend-srv](https://github.com/abobija/wiattend-srv). This client is part of [wiattend](https://github.com/abobija/wiattend) RFID attendance system project.

## Overview

By opening ``index.html`` file, client starts and request for all tags will be sent to NodeJS server [wiattend-srv](https://github.com/abobija/wiattend-srv). After all tags are shown, permanent connection will be established with [wiattend-srv](https://github.com/abobija/wiattend-srv) via WebSocket channel. When [wiattend](https://github.com/abobija/wiattend) sends new serial number of applied RFID card to server, ``logged`` event will be broadcasted to all subscribed clients. By using permanent WS connection **log-in** / **log-out** events are shown in real time with help of awesome CSS animations.

## Abstraction

![](doc/img/idea.png)

## Used Techologies
  - HTML
  - CSS
  - JavaScript
