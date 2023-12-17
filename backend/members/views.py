"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
MEMBERS VIEWS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import six
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response 
from rest_framework import status


class UserTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        user_id = six.text_type(user.pk)
        ts = six.text_type(timestamp)
        is_active = six.text_type(user.is_active)
        return f"{user_id}{ts}{is_active}"

@api_view(['POST'])
def ClickLogin(request):

    # check credentials and status 

    reqEmail = request.data.get('email') 
    reqPass = request.data.get('password')  

    userMd = get_user_model().objects.getUser(email=reqEmail)
    if not userMd:
        return Response({'detail': 'Credentials not found.'}, status=status.HTTP_404_NOT_FOUND)

    checkPass = userMd.check_password(reqPass)
    if not checkPass:
        return Response({'detail': 'Credentials not found.'}, status=status.HTTP_404_NOT_FOUND)

    if not userMd.verified:
        return Response({'detail': 'User not verified.'}, status=status.HTTP_403_FORBIDDEN)

    if not userMd.active:
        return Response({'detail': 'User not active.'}, status=status.HTTP_403_FORBIDDEN)

    # generate tokens 

    import rest_framework_simplejwt.tokens as TK 
    tokenMaker = TK.RefreshToken()
    token = tokenMaker.for_user(userMd)

    return Response({
        'user': userMd.user_name, 
        'access': str(token.access_token), 
        'refresh': str(token), 
    })

@api_view(['POST'])
def TokenRefresh(request):

    # get the new access token

    refreshToken = request.data.get('refresh') 

    try:
        import rest_framework_simplejwt.serializers as SR
        serializer = SR.TokenRefreshSerializer(data={'refresh': refreshToken})
        serializer.is_valid()
        accessToken = serializer.validated_data['access']
    except Exception as ex:
        return Response({'detail': 'Refresh serializer error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # get user model from the token

    import jwt
    from app_proj.settings import SIMPLE_JWT
    refreshDx = jwt.decode(refreshToken, SIMPLE_JWT['SIGNING_KEY'], algorithms=[SIMPLE_JWT['ALGORITHM']])

    userMd = get_user_model().objects.getUser(id=refreshDx['user_id'])
    if not userMd:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'user': userMd.user_name, 
        'admin': userMd.is_superuser, 
        'access': accessToken, 
        'refresh': None, 
    })

@api_view(['POST'])
def CreateUser(request): 

    newEmail = request.data.get('email') 
    newPass = request.data.get('password')  

    try:
        userMd = get_user_model().objects.create_user(email=newEmail, password=newPass)
        userMd.save()
    except Exception as ex:
        return Response({'detail': ex}, status=status.HTTP_406_NOT_ACCEPTABLE)

    return Response('User is registered. Sending verification email ...')

@api_view(['POST'])
def SendVerification(request): 
    # this is called after create user in an axios chain
    # also called by send verification button

    # check for errors 

    verifyEmail = request.data.get('email') 
    userMd = get_user_model().objects.getUser(email=verifyEmail)

    if not userMd:
        return Response({'detail': 'Email not in use.'}, status=status.HTTP_404_NOT_FOUND)

    if userMd.verified:
        return Response({'detail': 'User is already verified.'}, status=status.HTTP_406_NOT_ACCEPTABLE)

    # send confirmation email 

    tokenMaker = UserTokenGenerator()
    token = tokenMaker.make_token(userMd)

    try:
        import os, datetime
        from django.core.mail import EmailMessage
        from django.template.loader import get_template
        import app_proj.settings as ST

        frontendDomain = ST.CORS_ORIGIN_WHITELIST[0] if ST.DEPLOYMENT_ENV == 'DEV' else ST.CORS_ORIGIN_WHITELIST[-1] 
        expireDate = datetime.datetime.now() + datetime.timedelta(days=ST.PASSWORD_RESET_TIMEOUT_DAYS)

        EMAIL_TEMPLATE = os.path.join(ST.BACKEND_PATH, 'members', 'data', 'register-email.html')
        message = get_template(EMAIL_TEMPLATE).render({
            'confirmUrl': f"{frontendDomain}/verify-email/{userMd.unique_id}/{token}/",
            'expireDate': expireDate.strftime('%b %d, %Y @ %I:%M %p'),
        })

        mail = EmailMessage('Verify Your Email', message, to=[userMd.email], 
            from_email=f"Thieves' Guild <{ST.EMAIL_HOST_USER}>")
        mail.content_subtype = 'html'
        mail.send()
    except Exception as ex:
        return Response({'detail': str(ex)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response('If the email address is in use a verification email has been sent. Please check your spam folder.')

@api_view(['POST'])
def VerifyRegistration(request): 

    userId = request.data.get('userId') 
    token = request.data.get('token')  

    userMd = get_user_model().objects.getUser(unique_id=userId)
    if not userMd:
        return Response({'detail': 'Credentials not found'}, status=status.HTTP_404_NOT_FOUND)

    if userMd.verified:
        return Response({'detail': 'User is already verified'}, status=status.HTTP_406_NOT_ACCEPTABLE)

    tokenMaker = UserTokenGenerator()
    if tokenMaker.check_token(userMd, token):
        userMd.verified = True
        userMd.active = True
        userMd.save()
        print('authed and saved')
    else:
        return Response({'detail': 'Token not authenticated'}, status=status.HTTP_406_NOT_ACCEPTABLE)

    return Response('Email verified. You may now log in.')

@api_view(['POST'])
def ForgotPassword(request): 

    forgotEmail = request.data.get('email') 

    userMd = get_user_model().objects.getUser(email=forgotEmail)
    if not userMd:
        return Response('If there is a user with that address, they were sent a password reset email.')

    tokenMaker = UserTokenGenerator()
    token = tokenMaker.make_token(userMd)

    # send reset email 

    try:
        import os, datetime
        from django.core.mail import EmailMessage
        from django.template.loader import get_template
        import app_proj.settings as ST

        frontendDomain = ST.CORS_ORIGIN_WHITELIST[0] if ST.DEPLOYMENT_ENV == 'DEV' else ST.CORS_ORIGIN_WHITELIST[-1] 
        expireDate = datetime.datetime.now() + datetime.timedelta(days=ST.PASSWORD_RESET_TIMEOUT_DAYS)

        EMAIL_TEMPLATE = os.path.join(ST.BACKEND_PATH, 'members', 'data', 'forgot-password.html')
        message = get_template(EMAIL_TEMPLATE).render({
            'resetUrl': f"{frontendDomain}/new-password/{userMd.unique_id}/{token}/",
            'expireDate': expireDate.strftime('%b %d, %Y @ %I:%M %p'),
        })

        mail = EmailMessage('Reset Your Password', message, to=[userMd.email], 
            from_email=f"Thieves' Guild <{ST.EMAIL_HOST_USER}>")
        mail.content_subtype = 'html'
        mail.send()
    except Exception as ex:
        return Response({'detail': str(ex)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    return Response('If there is a user with that address, they were sent a password reset email.')

@api_view(['POST'])
def ResetPassword(request): 

    userId = request.data.get('userId') 
    token = request.data.get('token')  
    newPassword = request.data.get('password')  

    userMd = get_user_model().objects.getUser(unique_id=userId)
    if not userMd:
        return Response({'detail': 'Credentials not found'}, status=status.HTTP_404_NOT_FOUND)

    tokenMaker = UserTokenGenerator()
    if tokenMaker.check_token(userMd, token):
        userMd.set_password(newPassword)
        userMd.save()
    else:
        return Response({'detail': 'Token not authenticated'}, status=status.HTTP_406_NOT_ACCEPTABLE)

    return Response('Your password has been changed.')

