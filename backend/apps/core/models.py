"""
Django models for PRIME (Centralized Academic Project Hub).
"""

from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile with role information."""
    
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('faculty', 'Faculty'),
        ('admin', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    bio = models.TextField(blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.get_role_display()})"
    
    class Meta:
        ordering = ['-created_at']


class TeamMember(models.Model):
    """Team member information for projects."""
    
    name = models.CharField(max_length=255)
    email = models.EmailField()
    contribution = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']
        unique_together = ['name', 'email']


class Project(models.Model):
    """Project model for the academic projects hub."""
    
    STATUS_CHOICES = [
        ('public', 'Public'),
        ('locked', 'Locked'),
        ('approved', 'Approved'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=255)
    abstract = models.TextField()
    domains = models.JSONField(default=list)
    year = models.CharField(max_length=10)
    license = models.CharField(max_length=50)
    tech_stack = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='public')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    team_members = models.ManyToManyField(TeamMember, through='ProjectTeamMember')
    approved_faculty_ids = models.JSONField(default=list)
    approval_status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']


class ProjectTeamMember(models.Model):
    """Through model for Project and TeamMember relationship."""
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    team_member = models.ForeignKey(TeamMember, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
        unique_together = ['project', 'team_member']


class AccessRequest(models.Model):
    """Access request model for faculty members requesting project access."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='access_requests')
    faculty = models.ForeignKey(User, on_delete=models.CASCADE, related_name='access_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.project.title} - {self.faculty.get_full_name()}"
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['project', 'faculty']
