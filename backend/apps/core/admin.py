"""
Admin configuration for core app.
"""

from django.contrib import admin
from .models import UserProfile, Project, TeamMember, ProjectTeamMember, AccessRequest


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'created_at')
    list_filter = ('role', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email')
    list_filter = ('created_at',)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'status', 'year', 'created_at')
    list_filter = ('status', 'year', 'created_at')
    search_fields = ('title', 'abstract', 'owner__email')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ProjectTeamMember)
class ProjectTeamMemberAdmin(admin.ModelAdmin):
    list_display = ('project', 'team_member', 'order')
    list_filter = ('project',)


@admin.register(AccessRequest)
class AccessRequestAdmin(admin.ModelAdmin):
    list_display = ('project', 'faculty', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('project__title', 'faculty__email')
    readonly_fields = ('created_at', 'updated_at')
