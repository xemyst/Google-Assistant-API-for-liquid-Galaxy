import os

axios = {'x':1, 'y': 1 , 'z' :1 , 'picht':1, 'yaw':1,'roll':1 }


class SoaceNavigator(object):
    """docstring for SpaceNavigator Controler."""

    def __init__(self, path):
        self.path = path

    def goLeft():
        print("left")
        #axios['x']:
        #axios['y']:
        #axios['z']:
        #axios['pitch']:
        #axios['yaw']:
        #axios['roll']:

    def goRight():
        print("right")
    def goUp():
        print('up')
    def goDown():
        print('down')

    def writeEvent():
        os.system("echo writting event")
