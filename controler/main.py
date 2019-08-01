from socket import socket, SOCK_DGRAM, AF_INET
import os
#from spacenavigator import SpaceNavigator
sock = socket(SOCK_DGRAM,AF_INET)
#space = SpaceNavigator('./')


def getIp():
    s = socket(AF_INET, SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
    s.close()
    print(ip)
    return ip



sock.bind((getIp(),3456))

while 1:
    paquet = sock.recv(1024)
    paquet = paquet.decode('utf-8')
    print(paquet)
    if 'left' == paquet:
        pass
        #space.goLeft()
    elif 'right' == paquet:
        pass
        #space.goLeft()
    elif 'top' == paquet :
        pass
        #space.goLeft()
    elif 'zoom' == paquet:
        pass
        #space.goLeft()
    elif 'stop' == paquet:
        pass
        #space.stop()
