from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("accounts/login/", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("accounts/register/", views.register, name="register"),

    # API Routes
    path("emails", views.compose, name="compose"),
    path("emails/<int:email_id>", views.email, name="email"),
    path("emails/<str:mailbox>", views.mailbox, name="mailbox"),
    path("delete/<int:email_id>", views.delete_email, name="delete"),
    path("delete/<int:email_id>", views.delete_email, name="delete"),
    path("trash/", views.trash, name="trash"),
    path("trashed/<int:email_id>", views.trashed_email)
]