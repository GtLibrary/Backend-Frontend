from api.authentication.viewsets import (
    RegisterViewSet,
    LoginViewSet,
    ActiveSessionViewSet,
    LogoutViewSet,
)
from api.booktype.api import BookTypeCreateApi, BookTypeDeleteApi, BookTypeUpdateApi, BookTypeApi
from rest_framework import routers
from api.user.viewsets import UserViewSet
from django.urls import path, include

router = routers.SimpleRouter(trailing_slash=False)

router.register(r"users/edit", UserViewSet, basename="user-edit")

router.register(r"users/register", RegisterViewSet, basename="register")

router.register(r"users/login", LoginViewSet, basename="login")

router.register(r"users/checkSession", ActiveSessionViewSet, basename="check-session")

router.register(r"users/logout", LogoutViewSet, basename="logout")

# router.register(r"booktype/save", BookTypeCreateApi.as_view(), basename="save")

urlpatterns = [
    *router.urls,
    path("booktype/save", BookTypeCreateApi.as_view()),
    path("booktype/list", BookTypeApi.as_view()),
]
