from django.core.management.base import BaseCommand
from api.seed_data import seed_all

class Command(BaseCommand):
    help = 'Initialise les données du MVP (stratégies, programme 30 jours, rappels et profil initial)'

    def handle(self, *args, **options):
        seed_all()
        self.stdout.write(self.style.SUCCESS('Données initiales chargées avec succès pour Nosmokvng.'))
