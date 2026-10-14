from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from api.models import UserProfile, CravingEvent, DailyCheckIn, Strategy, RelapseEvent
from api.seed_data import seed_all

class NosmokvngAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        seed_all()

    def test_seed_data_loaded(self):
        """Vérifie que les stratégies et le parcours 30 jours sont initialisés."""
        self.assertGreaterEqual(Strategy.objects.count(), 7)
        self.assertEqual(UserProfile.objects.count(), 1)

    def test_profile_and_stats(self):
        """Vérifie les calculs d'économies et de cigarettes évitées."""
        profile = UserProfile.objects.first()
        self.assertEqual(profile.cigarettes_per_day, 15)
        self.assertEqual(float(profile.pack_price), 700.0)
        self.assertEqual(profile.currency, 'FCFA')
        
        # Test endpoint stats
        response = self.client.get('/api/stats/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('duration', data)
        self.assertIn('estimates', data)
        self.assertIn('milestones', data)

    def test_create_craving_under_30_seconds(self):
        """Vérifie qu'une envie peut être enregistrée rapidement sans texte obligatoire."""
        response = self.client.post('/api/cravings/', {
            'trigger': 'stress',
            'intensity_before': 8,
            'intensity_after': 3,
            'outcome': 'resisted',
            'strategies_used': ['protocole-10-minutes']
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(CravingEvent.objects.count(), 1)
        craving = CravingEvent.objects.first()
        self.assertEqual(craving.trigger, 'stress')
        self.assertEqual(craving.intensity_before, 8)
        self.assertEqual(craving.intensity_after, 3)

    def test_relapse_without_judgment(self):
        """Vérifie l'enregistrement d'un faux pas pour apprentissage immédiat."""
        response = self.client.post('/api/relapses/', {
            'context': 'Soirée entre amis',
            'feeling': 'Solitude soudaine',
            'what_happened_before': 'Discussion intense',
            'helpful_action_next_time': 'Garder les mains occupées avec une paille et appeler un ami'
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(RelapseEvent.objects.count(), 1)

    def test_journey_toggle(self):
        """Vérifie qu'on peut cocher un jour du parcours."""
        response = self.client.post('/api/journey/1/toggle/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['completed'])
