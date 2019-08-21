import requests, sys
import time
args = sys.argv[1:]

API_IP = 'http://192.168.1.39:8080'
AIRMASHUP_IP='http://192.168.1.37:8080'

url = '%s/kml/manage/clean' % API_IP
response = requests.get(url,files={'file':''})
def stopPython():
    url = "%s/stop" % AIRMASHUP_IP
    print(url)
    response = requests.get(url)

if(args[0]=='callsign'):
    stopPython()
    url = "%s/sendAircraftCallsign" % AIRMASHUP_IP
    print(url, args[1])
    response = requests.post(url,data={'callsign': args[1]}, files={'file':''})
elif(args[0]=='airline'):
    stopPython()
    url = "%s/sendAircraftCompanies" % AIRMASHUP_IP
    print(url)
    response = requests.post(url,data={'callsign': args[1]}, files={'file':''})
elif(args[0]=='wing'):
    stopPython()
    url = "%s/submitWing" % AIRMASHUP_IP
    print(url)
    response = requests.get(url)
elif(args[0]=='all'):
    stopPython()
    url = "%s/sendGlobalAircraft" % AIRMASHUP_IP
    print(url)
    response = requests.get(url)
#
# time.sleep(1)
#
# response = requests.get(url,files={'file':''})
# print("> Answer received by LiquidGalaxy [%s]. "% response.status_code)
