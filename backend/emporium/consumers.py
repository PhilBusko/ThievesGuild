"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
LEGO CONSUMERS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import json, time, threading
from django.contrib.auth import get_user_model
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync


class SampleConsumer(WebsocketConsumer):

    # infrastructure

    def connect(self):

        # get user model from the token

        refreshToken = self.scope['url_route']['kwargs']['token']

        import jwt
        from app_proj.settings import SIMPLE_JWT
        refreshDx = jwt.decode(refreshToken, SIMPLE_JWT['SIGNING_KEY'], algorithms=[SIMPLE_JWT['ALGORITHM']])

        userMd = get_user_model().objects.getUser(id=refreshDx['user_id'])
        if not userMd:
            raise Exception('No user for refresh token.')

        # accept connection if user is found 

        self.room_name = userMd.unique_id
        self.room_group_name = f"group.{userMd.unique_id}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name)

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name)

    def receive(self, text_data):

        inputMsg = json.loads(text_data) if text_data else {}
        functionType = inputMsg.get('functionType')

        if functionType == 'start-process':
            self.runProcess()

        else:
            raise Exception(f"function type unknown: {functionType}")

    def receiveGroup(self, event):  
        outputMsg = event['message']
        self.send(text_data=json.dumps(outputMsg))


    # customizations

    def runProcess(self): 

        # start the process

        def processRecursive(progressIncr, progressMax):

            # calculate for this iteration

            time.sleep(3)
            progressIncr += 1

            # send update to frontend

            outputMsg = {
                'functionType': 'update',
                'payload': round(progressIncr / progressMax * 100, 0),
            }
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name, {'type': 'receiveGroup', 'message': outputMsg})

            # launch next iteration in a thread
            # messages are only sent once function finishes

            if progressIncr < progressMax:
                thread = threading.Thread(target=processRecursive, args=(progressIncr, progressMax))
                thread.start()

        progressIncr = 0
        progressMax = 5

        thread = threading.Thread(target=processRecursive, args=(progressIncr, progressMax))
        thread.start()

        # send initial acknowledgement

        outputMsg = {
            'functionType': 'update',
            'payload': 1,
        }
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {'type': 'receiveGroup', 'message': outputMsg})
