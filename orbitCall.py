import requests, sys
import time
args = sys.argv[1:]
print(args)
API_IP = '10.33.34.109:8080'
data = {
    'id':args[0],
    'name':args[0],
    'longitude':args[1],
    'latitude':args[2],
    'range': args[3]
}
response = requests.get('http://10.33.34.109:8080/kml/manage/clean',files={'file':''})

url = "http://10.33.34.109:8080/kml/builder/orbit"
response = requests.post(url,data=data, files={'file':''})
time.sleep(1)
url = "http://10.33.34.109:8080/kml/manage/initTour/" + args[0]
response = requests.get(url,files={'file':''})
print("> Answer received by LiquidGalaxy [%s]. "% response.status_code)
