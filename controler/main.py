from socket import socket, SOCK_DGRAM, AF_INET
sock = socket(SOCK_DGRAM,AF_INET)

speed = {0:1, 1: 1 ,2:1 , 3:1 }


def getIp():
    s = socket(AF_INET, SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
    s.close()
    return ip

def writeSpaceNavigator():



sock.bind((getIp(),3456))

while 1:
    paquet = sock.recv(1024)
    paquet = paquet.decode('utf-8')
    if 'left' == "":
        pass
    elif 'right' == "":
        pass
    elif 'top' == "" :
        pass

    writeSpaceNavigator()
