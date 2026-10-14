from django.db import models
from django.utils import timezone

class UserProfile(models.Model):
    """
    Profil de départ et préférences de l'utilisateur pour le sevrage tabagique.
    Conforme aux spécifications MVP et respectueux de la vie privée.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Habitudes initiales
    cigarettes_per_day = models.PositiveIntegerField(default=15, help_text="Consommation moyenne quotidienne")
    smoking_duration_years = models.DecimalField(max_digits=4, decimal_places=1, default=3.0, help_text="Nombre d'années de tabagisme")
    first_cigarette_delay_minutes = models.PositiveIntegerField(default=45, help_text="Délai moyen après le réveil (minutes)")
    
    # Coût et monnaie (par défaut FCFA pour le Bénin : paquet à 700 FCFA, soit 3 cig pour 100 FCFA)
    pack_price = models.DecimalField(max_digits=10, decimal_places=2, default=700.00, help_text="Prix moyen du paquet en monnaie locale")
    currency = models.CharField(max_length=10, default="FCFA", help_text="Monnaie utilisée (ex: FCFA, EUR, USD)")
    cigarettes_per_pack = models.PositiveIntegerField(default=20, help_text="Nombre de cigarettes par paquet")
    
    # Date d'arrêt officiel (par défaut mercredi 14 octobre 2026 à 08:00)
    quit_start_at = models.DateTimeField(default=timezone.now, help_text="Date et heure de début de l'arrêt")
    
    # Déclencheurs principaux choisis
    triggers = models.JSONField(
        default=list, 
        blank=True, 
        help_text="Liste des déclencheurs principaux (stress, solitude, réveil, etc.)"
    )
    
    # Contact de confiance
    trusted_contact_name = models.CharField(max_length=120, blank=True, default="", help_text="Prénom ou surnom du contact fiable")
    trusted_contact_phone = models.CharField(max_length=50, blank=True, default="", help_text="Téléphone d'urgence bienveillante")
    
    # Préférences et consentement
    reminder_preferences = models.JSONField(default=dict, blank=True)
    privacy_consent = models.BooleanField(default=True)

    def daily_cost_estimate(self):
        """Estimation du coût journalier en monnaie locale."""
        if self.cigarettes_per_pack > 0:
            price_per_cigarette = float(self.pack_price) / float(self.cigarettes_per_pack)
            cost = price_per_cigarette * self.cigarettes_per_day
            return round(cost) if self.currency == 'FCFA' else round(cost, 2)
        return 0

    def __str__(self):
        return f"Profil utilisateur (Arrêt prévu : {self.quit_start_at.strftime('%d/%m/%Y %H:%M')})"


class CravingEvent(models.Model):
    """
    Événement d'envie de fumer surmonté ou traversé.
    Enregistrable en moins de 30 secondes sans texte obligatoire.
    """
    TRIGGER_CHOICES = [
        ('stress', 'Stress'),
        ('nervosite', 'Nervosité'),
        ('emotion_brusque', 'Émotion négative ou vive'),
        ('solitude', 'Solitude'),
        ('reveil', 'Au réveil'),
        ('travail', 'Pause / Travail'),
        ('repas', 'Avant ou après le repas'),
        ('main_bouche', 'Geste main-bouche'),
        ('social', 'Pression sociale ou soirée'),
        ('autre', 'Autre'),
    ]

    OUTCOME_CHOICES = [
        ('resisted', 'Envie traversée avec succès'),
        ('postponed', 'Différée / Vague passée'),
        ('smoked', 'Cigarette fumée (faux pas analysé)'),
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    occurred_at = models.DateTimeField(default=timezone.now)
    trigger = models.CharField(max_length=50, choices=TRIGGER_CHOICES, default='stress')
    emotion = models.CharField(max_length=80, blank=True, default='', help_text="Émotion ressentie (anxiété, ennui, etc.)")
    intensity_before = models.PositiveSmallIntegerField(default=7, help_text="Intensité initiale de 0 à 10")
    intensity_after = models.PositiveSmallIntegerField(null=True, blank=True, help_text="Intensité après 10 minutes (0 à 10)")
    strategies_used = models.JSONField(default=list, blank=True, help_text="Identifiants des stratégies utilisées")
    outcome = models.CharField(max_length=20, choices=OUTCOME_CHOICES, default='resisted')
    notes = models.TextField(blank=True, default="", help_text="Notes libres facultatives")
    duration_seconds = models.PositiveIntegerField(default=600, help_text="Durée passée sur le protocole")

    class Meta:
        ordering = ['-occurred_at']

    def __str__(self):
        return f"Envie du {self.occurred_at.strftime('%d/%m %H:%M')} [{self.trigger}] - Avant: {self.intensity_before}/10"


class DailyCheckIn(models.Model):
    """
    Suivi quotidien sur 30 jours : Intention le matin, Bilan le soir.
    """
    date = models.DateField(default=timezone.now, unique=True)
    
    # Matin
    morning_intention = models.CharField(max_length=250, blank=True, default="", help_text="Intention de la journée")
    morning_risk = models.CharField(max_length=250, blank=True, default="", help_text="Principal risque prévu aujourd'hui")
    morning_strategy = models.CharField(max_length=250, blank=True, default="", help_text="Stratégie choisie")
    
    # Soir
    evening_cigarettes_smoked = models.PositiveIntegerField(default=0, help_text="Nombre de cigarettes fumées (objectif : 0)")
    evening_cravings_managed = models.PositiveIntegerField(default=0, help_text="Nombre d'envies traversées")
    mood_rating = models.PositiveSmallIntegerField(null=True, blank=True, help_text="Humeur de 1 à 5")
    money_saved_estimate = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    evening_learning = models.TextField(blank=True, default="", help_text="Une chose apprise aujourd'hui")
    evening_adjustment = models.TextField(blank=True, default="", help_text="Un ajustement pour demain")

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Bilan du {self.date} (Cigarettes: {self.evening_cigarettes_smoked})"


class Strategy(models.Model):
    """
    Bibliothèque de stratégies comportementales et cognitives.
    """
    CATEGORY_CHOICES = [
        ('respiration', 'Respiration & Cohérence'),
        ('mouvement', 'Mouvement & Déplacement'),
        ('ancrage', 'Ancrage & Présence'),
        ('main_bouche', 'Alternatives main-bouche'),
        ('emotion', 'Gestion des émotions & PAUSE'),
        ('anticipation', 'Préparation aux situations à risque'),
    ]

    slug = models.SlugField(max_length=100, unique=True)
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='respiration')
    trigger_tags = models.JSONField(default=list, blank=True)
    short_description = models.CharField(max_length=255)
    instructions = models.TextField(help_text="Étapes d'action concrètes et guidées")
    duration_seconds = models.PositiveIntegerField(default=120)
    evidence_note = models.CharField(max_length=255, blank=True, default="")
    safety_note = models.CharField(max_length=255, blank=True, default="")
    active = models.BooleanField(default=True)
    icon_name = models.CharField(max_length=50, default="HeartPulse")

    class Meta:
        ordering = ['category', 'title']

    def __str__(self):
        return f"{self.title} ({self.category})"


class RelapseEvent(models.Model):
    """
    Faux pas ou cigarette fumée : parcours sans culpabilisation et reprise immédiate.
    """
    occurred_at = models.DateTimeField(default=timezone.now)
    context = models.CharField(max_length=200, help_text="Où étais-je ? Qui était présent ?")
    feeling = models.CharField(max_length=200, help_text="Que ressentais-je ?")
    what_happened_before = models.TextField(help_text="Qu'est-ce qui s'est passé juste avant ?")
    helpful_action_next_time = models.TextField(help_text="Quelle modification concrète pour la prochaine fois ?")
    next_action_immediate = models.CharField(max_length=200, default="Reprendre le plan immédiatement, boire un verre d'eau et ranger tout résidu.")
    cigarettes_count = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['-occurred_at']

    def __str__(self):
        return f"Faux pas du {self.occurred_at.strftime('%d/%m %H:%M')} - {self.cigarettes_count} cigarette(s)"


class Reminder(models.Model):
    """
    Rappels configurables : matin, pause travail, avant repas, ou personnalisé.
    """
    time_str = models.CharField(max_length=5, help_text="Format HH:MM (ex: 08:30)")
    title = models.CharField(max_length=100)
    message = models.CharField(max_length=255)
    context = models.CharField(max_length=50, default="custom")
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return f"[{self.time_str}] {self.title} ({'Actif' if self.enabled else 'Désactivé'})"


class JourneyDay(models.Model):
    """
    Parcours d'accompagnement progressif sur 30 jours.
    """
    day_number = models.PositiveSmallIntegerField(unique=True)
    phase_title = models.CharField(max_length=100)
    title = models.CharField(max_length=150)
    summary = models.TextField()
    action_today = models.TextField()
    mantra = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['day_number']

    def __str__(self):
        return f"Jour {self.day_number} : {self.title}"
