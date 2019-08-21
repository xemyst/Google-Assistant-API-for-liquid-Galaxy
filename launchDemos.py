import requests, sys
import time
args = sys.argv[1:]

API_IP = 'http://192.168.1.39:8080'
AIRMASHUP_IP='http://192.168.1.37:8080'
DRONECORIA_IP='http://'
url = '%s/kml/manage/clean' % API_IP
response = requests.get(url,files={'file':''})
def stopPython():
    url = "%s/stop" % AIRMASHUP_IP
    print(url)
    response = requests.get(url)

if(args[0]=='albert'):
    stopPython()
    url = "%s/submitDemo" % AIRMASHUP_IP
    print(url)
    response = requests.get(url)
elif(args[0]=='marcel'):
    stopPython()
    url = "%s/demo/start" % DRONECORIA_IP
    print(url)
    response = requests.get(url)
