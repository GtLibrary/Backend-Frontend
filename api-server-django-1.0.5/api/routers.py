from api.authentication.viewsets import (
    RegisterViewSet,
    LoginViewSet,
    ActiveSessionViewSet,
    LogoutViewSet,
)
from api.booktype.api import BookTypeCreateApi, BookTypeDeleteApi, BookTypeUpdateApi, BookTypeApi
from api.origintype.api import OriginTypeCreateApi, OriginTypeDeleteApi, OriginTypeUpdateApi, OriginTypeApi
from api.books.api import BooksCreateApi, BooksDeleteApi, BooksUpdateApi, BooksApi
from api.uploadimage.api import UploadimageCreateApi
from rest_framework import routers
from api.user.viewsets import UserViewSet
from django.urls import path, include
from django.conf.urls import url
from api.books.views import getbooklist, getbookdatabyId, getBookContentbyId, art, myopenai
from api.wallet.views import WalletInfo, transaction_detail, deposit_funds, transfer, wallet_transactions, getwalletinfo
from api.nft import views as nft_views
from api.openaikey.views import save_openaikey, get_openaikey
from api.aiprice.views import AIpriceSet, getaiprice

router = routers.SimpleRouter(trailing_slash=False)

router.register(r"users/edit", UserViewSet, basename="user-edit")

router.register(r"users/register", RegisterViewSet, basename="register")

router.register(r"users/login", LoginViewSet, basename="login")

router.register(r"users/checkSession", ActiveSessionViewSet, basename="check-session")

router.register(r"users/logout", LogoutViewSet, basename="logout")

urlpatterns = [
    *router.urls,
    path("booktype/save", BookTypeCreateApi.as_view()),
    path("booktype/list", BookTypeApi.as_view()),
    path("booktype/delete/<int:pk>", BookTypeDeleteApi.as_view()),
    path("booktype/edit/<int:pk>", BookTypeUpdateApi.as_view()),
    path("origintype/save", OriginTypeCreateApi.as_view()),
    path("origintype/list", OriginTypeApi.as_view()),
    path("origintype/delete/<int:pk>", OriginTypeDeleteApi.as_view()),
    path("origintype/edit/<int:pk>", OriginTypeUpdateApi.as_view()),
    path("books/save", BooksCreateApi.as_view()),
    path("books/list", BooksApi.as_view()),
    path("books/delete/<int:pk>", BooksDeleteApi.as_view()),
    path("books/edit/<int:pk>", BooksUpdateApi.as_view()),
    path("uploadimage", UploadimageCreateApi.as_view()),
    path("getbooklist", getbooklist),
    path("bookdata/<int:pk>", getbookdatabyId),
    path("bookcontent/<int:pk>", getBookContentbyId),
    path('art/<int:pk>', art, name='art'),
    path('myopenai', myopenai),
    path('wallet_info', getwalletinfo),
    path('wallet/transactions', wallet_transactions),
    path('wallet/transactions/<int:transaction_pk>', transaction_detail),
    path('deposit', deposit_funds),
    path('transfer', transfer),
    path('saveapikey', save_openaikey),
    path('getapikey', get_openaikey),
    path('getaiprice', getaiprice),
    path('setaiprice', AIpriceSet.as_view()),


    url('^nft/', nft_views.nft, name='nft'),
]
