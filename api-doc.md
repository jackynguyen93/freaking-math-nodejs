# freaking-math api docs

## sync player

Endpoint: `/v1/player/sync`

Method: POST

Description: create or sync user data with server, call when open game.

Body:

| params     | type   | decription |
| ---------- | ------ | ---------- |
| playerID   | string | require    |
| playerName | string |            |
| avatar     | string |            |
| bestScore  | number |            |

Response:

```json
{
  "code": 200,
  "msg": "OK"
}
```

## update game status

Endpoint: `/v1/context/ready`

Method: POST

Decription: create new room with 2 player, call when match 2 player success in pvp mode

Body:

| params    | type   | decription    |
| --------- | ------ | ------------- |
| contextID | string | require       |
| playerID  | string | require       |
| isReady   | bool   | default: true |

Response:

```json
{
  "code": 200,
  "msg": "OK"
}
```

## get opponent player

Endpoint: `/v1/context/opponent/info`

Method: GET

Params:

| params    | type   | decription |
| --------- | ------ | ---------- |
| contextID | string | required   |
| playerID  | string | required   |

Decription: call to get opponent info, call after join new game and after game over

Response:

```json
{
  "code": 200,
  "msg": "OK",
  "data": {
    "opponentID": "124352345",
    "opponentName": "An Binh",
    "opponentAvatar": "https://1.bp.blogspot.com/-rSZt-EcbQ9M/WDKskLq03XI/AAAAAAAAOps/UXTVLZ9ApDMc6cwXusgrKndugVKPk8lpgCK4B/s400/Phanpy.png",
    "opponentBestScore": 23,
    "opponentScore": 15
  }
}
```

## quit game

Endpoint: `/v1/context/quit/{contextID}`

Method: PUT

Decription: call when user quit game or switch to other context

Response:

```json
{
  "code": 200,
  "msg": "OK"
}
```

## end game

Endpoint: `/v1/context/end`

Method: POST

Decription: call when game over, sync new score

Body:

| params    | type   | decription |
| --------- | ------ | ---------- |
| contextID | string | required   |
| playerID  | string | required   |
| score     | number | required   |

Response:

```json
{
  "code": 200,
  "msg": "OK"
}
```

## subscribe game player

Endpoint: `/v1/player/subscribe`

Method: GET

Params:

| params    | type   | decription |
| --------- | ------ | ---------- |
| contextID | string | required   |
| playerID  | string | required   |

Decription: call to subscribe user to listen event from the game, should be call per 5 seconds

Response:

```json
{
  "code": 200,
  "msg": "OK",
  "data": {
    "event": "none"
  }
}
```

## challenge a player

Endpoint: `/v1/context/challenge`

Method: POST

Decription: call to challenge a player

Params:

| params     | type   | decription |
| ---------- | ------ | ---------- |
| contextID  | string | required   |
| opponentID | string | required   |

Response:

```json
{
  "code": 200,
  "msg": "OK"
}
```
