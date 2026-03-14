"""
URL configuration for core app API endpoints.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'profiles', views.UserProfileViewSet, basename='profile')
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'team-members', views.TeamMemberViewSet, basename='team-member')
router.register(r'access-requests', views.AccessRequestViewSet, basename='access-request')

urlpatterns = [
    path('', include(router.urls)),
]
