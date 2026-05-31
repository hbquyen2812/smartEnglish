# Create demo user accounts. Idempotent (safe to re-run).
# Run: python manage.py shell -c "exec(open('seed_users.py', encoding='utf-8').read())"
from django.contrib.auth.models import User
from accounts.models import UserProfile

ACCOUNTS = [
    ("quyenbaohuynh", "quyen123456"),
    ("khanhlinh", "linh123456"),
    ("quyendanang", "quyen123456"),
]

for username, password in ACCOUNTS:
    user, created = User.objects.get_or_create(username=username)
    user.set_password(password)
    user.is_active = True
    user.save()
    UserProfile.objects.get_or_create(user=user)
    print(("Created" if created else "Updated"), username)

print("Done. Total users:", User.objects.count())
