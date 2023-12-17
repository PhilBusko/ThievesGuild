"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
WEBSOCKET ROUTING
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
from django.urls import include, re_path
import engine.consumers as BC


websocket_urls = [
    re_path(r'ws-connect/(?P<token>[\w\.-]+)/$', BC.SampleConsumer.as_asgi()),
]

