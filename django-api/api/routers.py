from api.authentication.viewsets import (
    RegisterViewSet,
    LoginViewSet,
    ActiveSessionViewSet,
    LogoutViewSet,
)
from rest_framework import routers
from api.user.viewsets import UserViewSet

router = routers.SimpleRouter(trailing_slash=False)

router.register(r"users/edit", UserViewSet, basename="user-edit")

router.register(r"users/register", RegisterViewSet, basename="register")

router.register(r"users/login", LoginViewSet, basename="login")

router.register(r"users/checkSession", ActiveSessionViewSet, basename="check-session")

router.register(r"users/logout", LogoutViewSet, basename="logout")

urlpatterns = [
    *router.urls,
]
