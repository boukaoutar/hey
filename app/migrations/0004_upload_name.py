# Generated by Django 3.2.4 on 2021-06-17 08:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_upload'),
    ]

    operations = [
        migrations.AddField(
            model_name='upload',
            name='name',
            field=models.CharField(max_length=25, null=True),
        ),
    ]
