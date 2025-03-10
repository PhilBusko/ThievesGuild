"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
HTTP URLS
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
from django.urls import include, re_path
import members.views as MV
import engine.views as NV


auth_url = [
    re_path(r'^click-login',        MV.ClickLogin ),
    re_path(r'^token-refresh',      MV.TokenRefresh ),
    re_path(r'^create-user',        MV.CreateUser ),
    re_path(r'^send-verification',      MV.SendVerification ),
    re_path(r'^verify-registration',    MV.VerifyRegistration),
    re_path(r'^forgot-password',        MV.ForgotPassword),
    re_path(r'^reset-password',         MV.ResetPassword),
]

emporium_url = [
    # re_path(r'^tower', CV.UserAccount), 
]

engine_url = [
    re_path(r'^user-account',   NV.UserAccount),
    re_path(r'^chosen-guild',   NV.ChosenGuild),
    re_path(r'^guild-info',     NV.GuildInfo),

    re_path(r'^create-guild',   NV.CreateGuild),
    re_path(r'^select-guild',   NV.SelectGuild),
    re_path(r'^delete-guild',   NV.DeleteGuild),

    re_path(r'^castle-details',     NV.CastleDetails),
    re_path(r'^create-permission',  NV.CreatePermission),
    re_path(r'^create-room',        NV.CreateRoom),
    re_path(r'^upgrade-permission', NV.UpgradePermission),
    re_path(r'^upgrade-room',       NV.UpgradeRoom),
    re_path(r'^move-room',          NV.MoveRoom),
    re_path(r'^delete-permission',  NV.DeletePermission),
    re_path(r'^delete-room',        NV.DeleteRoom),
    re_path(r'^training-details',   NV.TrainingDetails),
    re_path(r'^training-start',     NV.TrainingStart),
    re_path(r'^castle-finalize',    NV.CastleFinalize),

    re_path(r'^thief-details',  NV.ThiefDetails),
    re_path(r'^vault-details',  NV.VaultDetails),
    re_path(r'^change-equip',   NV.ChangeEquip),
    re_path(r'^retire-thief',   NV.RetireThief),
    re_path(r'^sell-item',      NV.SellItem),

    re_path(r'^daily-heists',       NV.DailyHeists),
    re_path(r'^set-heist',          NV.SetLastHeist),
    re_path(r'^launch-landing',     NV.LaunchLanding),
    re_path(r'^finish-landing',     NV.FinishLanding),

    re_path(r'^expedition-update',  NV.ExpeditionUpdate),
    re_path(r'^expedition-launch',  NV.ExpeditionLaunch),
    re_path(r'^expedition-claim',   NV.ExpeditionClaim),

    re_path(r'^daily-market',       NV.DailyMarket),
    re_path(r'^buy-permission',     NV.BuyPermission),
    re_path(r'^buy-market',         NV.BuyMarket),
    re_path(r'^gem-exchange',       NV.GemExchange),
]

urlpatterns = [
    re_path(r'^auth/',      include((auth_url, 'auth_url'))),
    re_path(r'^emporium/',  include((emporium_url, 'emporium_url'))),
    re_path(r'^engine/',    include((engine_url, 'engine_url'))),
]

