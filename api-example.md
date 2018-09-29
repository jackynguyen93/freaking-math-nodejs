```
curl -X GET "localhost:1337/?hub.verify_token=MY_VERIFY_TOKEN&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
```

```
curl -X POST \
  http://localhost:1337/v1/context/end \
  -H 'Cache-Control: no-cache' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 7df0d3dc-4c85-42af-b4a5-56079be765c8' \
  -d '{
	"contextID": "12341234",
	"playerID": "9999",
	"score": 7
}'
```
