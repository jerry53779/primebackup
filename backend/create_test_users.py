#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from apps.core.models import UserProfile

# Create student user
student = User.objects.create_user(
    username='student1',
    email='student1@university.edu',
    first_name='John',
    last_name='Student',
    password='student123'
)
UserProfile.objects.create(user=student, role='student')

# Create faculty user
faculty = User.objects.create_user(
    username='faculty1',
    email='faculty1@university.edu',
    first_name='Jane',
    last_name='Faculty',
    password='faculty123'
)
UserProfile.objects.create(user=faculty, role='faculty')

print("\n✅ Test users created successfully!")
print("\nLogin Credentials:")
print("  Admin:   admin / admin123")
print("  Student: student1 / student123")
print("  Faculty: faculty1 / faculty123")
print("\n📍 Admin Panel: http://localhost:8000/admin/")
print("📍 Frontend:    http://localhost:5173/")
