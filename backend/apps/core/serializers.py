"""
Serializers for PRIME API endpoints.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Project, TeamMember, ProjectTeamMember, AccessRequest


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'role']
        read_only_fields = ['id']
    
    def get_role(self, obj):
        """Get user role from profile."""
        profile = getattr(obj, 'profile', None)
        return profile.role if profile else 'student'


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['user', 'role', 'bio', 'avatar_url', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class TeamMemberSerializer(serializers.ModelSerializer):
    """Serializer for TeamMember model."""
    
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'email', 'contribution', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for Project model."""
    
    owner = UserSerializer(read_only=True)
    team_members = serializers.SerializerMethodField()
    owner_id = serializers.CharField(source='owner.id', read_only=True)
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'abstract', 'domains', 'year', 'license', 'tech_stack',
            'status', 'owner', 'owner_id', 'owner_name', 'team_members',
            'approved_faculty_ids', 'approval_status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'owner', 'owner_id', 'owner_name']
    
    def get_team_members(self, obj):
        """Get team members for project."""
        team_members = obj.team_members.through.objects.filter(
            project=obj
        ).order_by('order')
        return [
            {
                'name': tm.team_member.name,
                'email': tm.team_member.email,
                'contribution': tm.team_member.contribution,
                'id': tm.team_member.id
            }
            for tm in team_members
        ]


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating projects."""
    
    team_members = TeamMemberSerializer(many=True, required=False)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'abstract', 'domains', 'year', 'license', 'tech_stack',
            'status', 'team_members', 'approved_faculty_ids', 'approval_status'
        ]
    
    def create(self, validated_data):
        """Create project with team members."""
        team_members_data = validated_data.pop('team_members', [])
        validated_data['owner'] = self.context['request'].user
        project = Project.objects.create(**validated_data)
        
        for order, member_data in enumerate(team_members_data):
            team_member, _ = TeamMember.objects.get_or_create(**member_data)
            ProjectTeamMember.objects.create(
                project=project,
                team_member=team_member,
                order=order
            )
        
        return project
    
    def update(self, instance, validated_data):
        """Update project with team members."""
        team_members_data = validated_data.pop('team_members', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if team_members_data is not None:
            instance.projectteammember_set.all().delete()
            for order, member_data in enumerate(team_members_data):
                team_member, _ = TeamMember.objects.get_or_create(**member_data)
                ProjectTeamMember.objects.create(
                    project=instance,
                    team_member=team_member,
                    order=order
                )
        
        return instance


class AccessRequestSerializer(serializers.ModelSerializer):
    """Serializer for AccessRequest model."""
    
    faculty_id = serializers.CharField(source='faculty.id', read_only=True)
    faculty_name = serializers.CharField(source='faculty.get_full_name', read_only=True)
    project_id = serializers.CharField(source='project.id', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = AccessRequest
        fields = [
            'id', 'project_id', 'project_title', 'faculty_id', 'faculty_name',
            'status', 'message', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'faculty_id', 'faculty_name', 'project_id', 'project_title']


class AccessRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating access requests."""
    
    class Meta:
        model = AccessRequest
        fields = ['id', 'project', 'message']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        """Create access request."""
        validated_data['faculty'] = self.context['request'].user
        return super().create(validated_data)
