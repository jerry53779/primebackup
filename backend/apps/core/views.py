"""
Views for PRIME API endpoints.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
import uuid

from .models import UserProfile, Project, TeamMember, AccessRequest
from .serializers import (
    UserSerializer, UserProfileSerializer, ProjectSerializer,
    ProjectCreateUpdateSerializer, TeamMemberSerializer,
    AccessRequestSerializer, AccessRequestCreateSerializer
)


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Permission to only allow owners of an object to edit it."""
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for User model."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserProfileViewSet(viewsets.ViewSet):
    """ViewSet for UserProfile model."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def list(self, request):
        """List all user profiles."""
        profiles = UserProfile.objects.all()
        serializer = UserProfileSerializer(profiles, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        """Get a specific user profile."""
        profile = get_object_or_404(UserProfile, user__id=pk)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile."""
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)


class ProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for Project model."""
    
    queryset = Project.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action in ['create', 'update', 'partial_update']:
            return ProjectCreateUpdateSerializer
        return ProjectSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new project."""
        if not request.data.get('id'):
            request.data['id'] = f"proj-{uuid.uuid4().hex[:12]}"
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        """Set owner to current user."""
        serializer.save(owner=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_projects(self, request):
        """Get current user's projects."""
        projects = Project.objects.filter(owner=request.user)
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def public(self, request):
        """Get all public projects."""
        projects = Project.objects.filter(status='public')
        serializer = self.get_serializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def request_access(self, request, pk=None):
        """Request access to a project."""
        project = self.get_object()
        access_request, created = AccessRequest.objects.get_or_create(
            project=project,
            faculty=request.user,
            defaults={
                'id': f"req-{uuid.uuid4().hex[:12]}",
                'message': request.data.get('message', '')
            }
        )
        serializer = AccessRequestSerializer(access_request)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[IsOwnerOrReadOnly])
    def approve_access(self, request, pk=None):
        """Approve access request for a project."""
        project = self.get_object()
        request_id = request.data.get('request_id')
        
        access_request = get_object_or_404(
            AccessRequest,
            id=request_id,
            project=project
        )
        
        access_request.status = 'approved'
        access_request.save()
        
        approved_faculty_ids = project.approved_faculty_ids or []
        if access_request.faculty.id not in approved_faculty_ids:
            approved_faculty_ids.append(access_request.faculty.id)
            project.approved_faculty_ids = approved_faculty_ids
            project.save()
        
        serializer = AccessRequestSerializer(access_request)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsOwnerOrReadOnly])
    def reject_access(self, request, pk=None):
        """Reject access request for a project."""
        project = self.get_object()
        request_id = request.data.get('request_id')
        
        access_request = get_object_or_404(
            AccessRequest,
            id=request_id,
            project=project
        )
        
        access_request.status = 'rejected'
        access_request.save()
        
        serializer = AccessRequestSerializer(access_request)
        return Response(serializer.data)


class TeamMemberViewSet(viewsets.ModelViewSet):
    """ViewSet for TeamMember model."""
    
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [permissions.IsAuthenticated]


class AccessRequestViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for AccessRequest model."""
    
    serializer_class = AccessRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get access requests for current user."""
        user = self.request.user
        made_by_user = AccessRequest.objects.filter(faculty=user)
        owned_projects = Q(project__owner=user)
        received_requests = AccessRequest.objects.filter(owned_projects)
        
        return (made_by_user | received_requests).distinct()
    
    @action(detail=False, methods=['get'])
    def my_requests(self, request):
        """Get current user's access requests."""
        requests = AccessRequest.objects.filter(faculty=request.user)
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def received_requests(self, request):
        """Get access requests for current user's projects."""
        requests = AccessRequest.objects.filter(project__owner=request.user)
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)
