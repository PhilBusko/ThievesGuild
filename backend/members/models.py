"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
MEMBERS MODELS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import django.db.models as MD
from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        newUser = self.model(email=email, **extra_fields)
        newUser.user_name = UserManager.beautifyName(email)
        newUser.unique_id = UserManager.getUniqueId(email)
        newUser.set_password(password)
        newUser.save(using=self._db)
        return newUser

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)

    def getUser(self, **kwargs):
        try:
            return self.get(**kwargs)
        except MD.ObjectDoesNotExist:
            return None

    def getUniqueId(baseTx):
        import hashlib
        baseEnc = baseTx.encode('utf-8')
        hashRaw = hashlib.md5(baseEnc).hexdigest()     # 32 digits
        hashID = ''
        for h in range(0, 9, 1):
            hashID += hashRaw[h].capitalize()
            if h in (2, 5): hashID += '-'
        return hashID

    def beautifyName(email):
        import re 
        local = email.split('@')[0]
        nameLs = re.split("[#!%$‘&+*–\-/=?^_`.{|}~]+", local)
        pretty = ''.join([n.capitalize() for n in nameLs if n])
        return pretty


class User(AbstractBaseUser, PermissionsMixin):

    # AbstractBaseUser
    # password = models.CharField(_('password'), max_length=128)
    # last_login = models.DateTimeField(_('last login'), blank=True, null=True)
    # is_superuser = MD.BooleanField(default=False)

    unique_id = MD.CharField(unique=True, max_length=11) 
    email = MD.EmailField(unique=True)
    user_name = MD.CharField(max_length=30)

    verified = MD.BooleanField(default=False)
    active = MD.BooleanField(default=False)
    date_joined = MD.DateTimeField(auto_now_add=True)
    #email_last_sent = MD.DateTimeField(null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['unique_id', 'user_name', 'password']



