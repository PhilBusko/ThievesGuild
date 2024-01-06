"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
DJANGO SETTINGS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import os

BACKEND_PATH = os.path.dirname(os.path.dirname(__file__))
DEPLOYMENT_ENV = os.environ.get('DEPLOYMENT_ENV', 'DEV')
# DEPLOYMENT_ENV = os.environ.get('DEPLOYMENT_ENV', 'PROD')
print('env:', DEPLOYMENT_ENV)


# APPLICATION

INSTALLED_APPS = [
    # django base
    # 'daphne',
    # 'channels',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # installed packages
    'rest_framework',
    'corsheaders',
    'django_extensions',
    # custom modules
    'members',
    'emporium',
    'engine',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # installed packages
    'corsheaders.middleware.CorsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BACKEND_PATH, 'members', 'data')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

ASGI_APPLICATION = 'app_proj.server_asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',      # for prod use redis
    }
}


# SERVER

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'thieves-guild-05cb8c06292b.herokuapp.com']
CORS_ORIGIN_WHITELIST = ['http://localhost:3000', 'https://thieves-guild.vercel.app']
DEBUG = True #if DEPLOYMENT_ENV == 'DEV' else False

ROOT_URLCONF = 'app_proj.urls'
STATIC_URL = 'static/'
STATIC_ROOT = 'app_proj.static'


# DATABASE

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BACKEND_PATH, 'app_db.sqlite3'),
    }
}
# if DEPLOYMENT_ENV == 'PROD':
#     DATABASES = {
#         'default': {
#             'ENGINE': 'django.db.backends.postgresql',
#             'HOST': 'db.bit.io',
#             'PORT': '5432',
#             'NAME': 'philbit/factory_db',
#             'USER': 'philbit',
#             'PASSWORD': 'v2_3u7Ry_kzPKmRDUUEszVtXhVx9jcPA',
#         }
#     }

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# REST AUTH API

SECRET_KEY = '2f#1c&Ah4fmth13v3sg41ldh00qlho#JKLvYji98'

AUTH_USER_MODEL = 'members.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework_simplejwt.authentication.JWTAuthentication',],
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=144),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=14),
    'UPDATE_LAST_LOGIN': True,
    'SIGNING_KEY': SECRET_KEY,
    'ALGORITHM': 'HS256',
}


# EMAIL

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'mail.hover.com'
EMAIL_HOST_USER = 'admin@busko.site'
EMAIL_HOST_PASSWORD = '2ws3ed$RF%TG' 
EMAIL_PORT = 465
EMAIL_USE_SSL = True
PASSWORD_RESET_TIMEOUT_DAYS = 1


# Internationalization

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'EST'
USE_I18N = True
USE_TZ = True

