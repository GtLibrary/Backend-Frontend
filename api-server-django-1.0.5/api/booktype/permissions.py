from rest_framework import permissions

class IsStaff(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return False


class IsOwner(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        if obj.author == request.user:
            return True
        return False

class IsSuperUser(permissions.BasePermission):

    def has_permission(self, request, view):
        print("is superuser =>",request.user.is_superuser)
        return bool(request.user and request.user.is_superuser)