from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

from home.models import Profile

class UserForm(forms.Form):
    username = forms.CharField(help_text='Enter User name')

    def clean_username(self):
        data = self.cleaned_data['username']

        try:
            user = User.objects.get(username=data)
            profile = Profile.objects.get(user=user)
            raise ValidationError(_('Data already exist'))
        except Profile.DoesNotExist:
            return data
        except User.DoesNotExist:
            raise ValidationError(_('There is no User'))