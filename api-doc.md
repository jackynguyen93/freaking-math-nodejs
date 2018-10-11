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
    "contextId": "12341234",
    "playerId": "124352345",
    "playerName": "An Binh",
    "avatar": "https://1.bp.blogspot.com/-rSZt-EcbQ9M/WDKskLq03XI/AAAAAAAAOps/UXTVLZ9ApDMc6cwXusgrKndugVKPk8lpgCK4B/s400/Phanpy.png",
    "bestScore": 23,
    "score": 3,
    "isReady": false
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

Endpoint: `/v2/player/subscribe`

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

Endpoint: `/v2/context/challenge`

Method: POST

Decription: call to challenge a player

Params:

| params     | type   | decription |
| ---------- | ------ | ---------- |
| playerID   | string | required   |
| opponentID | string | required   |

Response:

```json
{
  "code": 200,
  "msg": "OK"
}
```

## reject a challenge

Endpoint: `/v2/context/challenge/reject`

Method: POST

Decription: call to reject a challenge

Params:

| params     | type   | decription |
| ---------- | ------ | ---------- |
| playerID   | string | required   |
| opponentID | string | required   |

Response:

```json
{
  "code": 200,
  "msg": "OK"
}
```

## get challenge info

Endpoint: `/v2/context/challenge/info`

Method: GET

Decription: call to get info of a challenge

Params:

| params     | type   | decription |
| ---------- | ------ | ---------- |
| playerID   | string | required   |
| opponentID | string | required   |

Response:

```json
{
  "code": 200,
  "msg": "OK",
  "data": {
    "playerId": "124352345",
    "playerScore": 5,
    "status": "challenged",
    "opponentId": "12314141",
    "opponentScore": 8,
    "opponentName": "An Binh",
    "opponentAvatar": "https://1.bp.blogspot.com/-rSZt-EcbQ9M/WDKskLq03XI/AAAAAAAAOps/UXTVLZ9ApDMc6cwXusgrKndugVKPk8lpgCK4B/s400/Phanpy.png",
    "opponentBestScore": 23
  }
}
```

## end challenge

Endpoint: `/v2/context/challenge/end`

Method: POST

Decription: call to handle gameover of a challenge

Params:

| params     | type   | decription |
| ---------- | ------ | ---------- |
| playerID   | string | required   |
| opponentID | string | required   |
| score      | string | required   |

Response:

```json
{
  "code": 200,
  "msg": "OK"
}
```
