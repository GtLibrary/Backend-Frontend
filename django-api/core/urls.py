from django.urls import path, include

urlpatterns = [
    path("api/", include(("api.routers", "api"), namespace="api")),
]
