import csv
import json
from datetime import datetime, date
from django.utils import timezone
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import (
    UserProfile,
    CravingEvent,
    DailyCheckIn,
    Strategy,
    RelapseEvent,
    Reminder,
    JourneyDay
)
from .serializers import (
    UserProfileSerializer,
    CravingEventSerializer,
    DailyCheckInSerializer,
    StrategySerializer,
    RelapseEventSerializer,
    ReminderSerializer,
    JourneyDaySerializer
)
from .seed_data import seed_all


class UserProfileView(APIView):
    """Lecture et mise à jour du profil utilisateur."""
    def get(self, request):
        profile = UserProfile.objects.first()
        if not profile:
            seed_all()
            profile = UserProfile.objects.first()
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = UserProfile.objects.first()
        if not profile:
            profile = UserProfile.objects.create()
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StatsView(APIView):
    """
    Calcul des statistiques en temps réel :
    - Temps écoulé depuis l'arrêt (jours, heures, minutes, secondes)
    - Cigarettes évitées estimées
    - Argent économisé estimé
    - Nombre d'envies surmontées
    - Paliers de santé (étapes physiologiques)
    """
    def get(self, request):
        profile = UserProfile.objects.first()
        if not profile:
            seed_all()
            profile = UserProfile.objects.first()

        now = timezone.now()
        quit_time = profile.quit_start_at

        # Calcul de la durée
        if now >= quit_time:
            delta = now - quit_time
            total_seconds = int(delta.total_seconds())
            is_started = True
        else:
            delta = quit_time - now
            total_seconds = -int(delta.total_seconds())
            is_started = False

        days = max(0, total_seconds // 86400)
        hours = max(0, (total_seconds % 86400) // 3600)
        minutes = max(0, (total_seconds % 3600) // 60)
        seconds = max(0, total_seconds % 60)

        # Calcul estimations
        price_per_cig = float(profile.pack_price) / float(profile.cigarettes_per_pack) if profile.cigarettes_per_pack > 0 else 60.0
        days_fraction = max(0.0, total_seconds / 86400.0) if is_started else 0.0

        cigarettes_avoided_est = round(days_fraction * profile.cigarettes_per_day)
        raw_saved = cigarettes_avoided_est * price_per_cig
        money_saved_est = round(raw_saved) if profile.currency == 'FCFA' else round(raw_saved, 2)

        # Statistiques envies
        cravings_total = CravingEvent.objects.count()
        cravings_resisted = CravingEvent.objects.filter(outcome='resisted').count()
        relapses_count = RelapseEvent.objects.count()

        # Paliers de santé basés sur les repères de l'OMS
        hours_smoke_free = total_seconds / 3600 if is_started else 0
        milestones = [
            {
                "title": "20 minutes",
                "label": "Pression artérielle & pulsation",
                "desc": "La pression sanguine et le rythme cardiaque redeviennent normaux.",
                "progress": min(100, round((total_seconds / (20 * 60)) * 100)),
                "unlocked": total_seconds >= (20 * 60) if is_started else False,
            },
            {
                "title": "8 heures",
                "label": "Oxygénation du sang",
                "desc": "Le monoxyde de carbone dans le sang diminue de moitié ; l'oxygénation cellulaire se normalise.",
                "progress": min(100, round((hours_smoke_free / 8.0) * 100)),
                "unlocked": hours_smoke_free >= 8 if is_started else False,
            },
            {
                "title": "24 heures",
                "label": "Élimination des résidus",
                "desc": "Les poumons commencent à évacuer le mucus et les résidus de fumée.",
                "progress": min(100, round((hours_smoke_free / 24.0) * 100)),
                "unlocked": hours_smoke_free >= 24 if is_started else False,
            },
            {
                "title": "48 heures",
                "label": "Goût et odorat",
                "desc": "La nicotine est presque entièrement éliminée du corps ; les terminaisons nerveuses du goût se réveillent.",
                "progress": min(100, round((hours_smoke_free / 48.0) * 100)),
                "unlocked": hours_smoke_free >= 48 if is_started else False,
            },
            {
                "title": "72 heures",
                "label": "Respiration décuplée",
                "desc": "Les bronches se relâchent, respirer devient plus facile et le tonus énergétique augmente.",
                "progress": min(100, round((hours_smoke_free / 72.0) * 100)),
                "unlocked": hours_smoke_free >= 72 if is_started else False,
            },
            {
                "title": "2 semaines",
                "label": "Circulation et endurance",
                "desc": "La circulation sanguine globale s'améliore, l'effort physique devient plus aisé.",
                "progress": min(100, round((days / 14.0) * 100)),
                "unlocked": days >= 14 if is_started else False,
            },
            {
                "title": "1 mois",
                "label": "Capacité pulmonaire",
                "desc": "La toux et la fatigue diminuent, les cils bronchiques repoussent et protègent contre les infections.",
                "progress": min(100, round((days / 30.0) * 100)),
                "unlocked": days >= 30 if is_started else False,
            },
        ]

        return Response({
            "is_started": is_started,
            "quit_start_at": quit_time,
            "total_seconds": max(0, total_seconds),
            "duration": {
                "days": days,
                "hours": hours,
                "minutes": minutes,
                "seconds": seconds
            },
            "estimates": {
                "cigarettes_avoided": cigarettes_avoided_est,
                "money_saved": money_saved_est,
                "currency": profile.currency,
                "daily_cost": profile.daily_cost_estimate(),
            },
            "cravings": {
                "total": cravings_total,
                "resisted": cravings_resisted,
                "relapses": relapses_count
            },
            "milestones": milestones
        })


class CravingListCreateView(APIView):
    """Enregistrement et consultation des envies."""
    def get(self, request):
        trigger_filter = request.query_params.get('trigger', None)
        cravings = CravingEvent.objects.all()
        if trigger_filter:
            cravings = cravings.filter(trigger=trigger_filter)
        serializer = CravingEventSerializer(cravings[:100], many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CravingEventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CravingDetailView(APIView):
    """Suppression d'une envie spécifique."""
    def delete(self, request, pk):
        try:
            craving = CravingEvent.objects.get(pk=pk)
            craving.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CravingEvent.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class TodayCheckInView(APIView):
    """Gestion du check-in du jour (Matin / Soir)."""
    def get(self, request):
        today = timezone.localdate()
        checkin, created = DailyCheckIn.objects.get_or_create(date=today)
        serializer = DailyCheckInSerializer(checkin)
        return Response(serializer.data)

    def put(self, request):
        today = timezone.localdate()
        checkin, created = DailyCheckIn.objects.get_or_create(date=today)
        serializer = DailyCheckInSerializer(checkin, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StrategyListView(APIView):
    """Liste des stratégies comportementales et cognitives."""
    def get(self, request):
        if Strategy.objects.count() == 0:
            seed_all()
        trigger_param = request.query_params.get('trigger', None)
        strategies = Strategy.objects.filter(active=True)
        
        # Filtre optionnel par déclencheur
        if trigger_param:
            matching = [s for s in strategies if trigger_param in s.trigger_tags or 'autre' in s.trigger_tags]
            serializer = StrategySerializer(matching, many=True)
            return Response(serializer.data)
            
        serializer = StrategySerializer(strategies, many=True)
        return Response(serializer.data)


class RelapseEventView(APIView):
    """Enregistrement et historique bienveillant des faux pas."""
    def get(self, request):
        relapses = RelapseEvent.objects.all()[:50]
        serializer = RelapseEventSerializer(relapses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RelapseEventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReminderListView(APIView):
    """Gestion des rappels configurables."""
    def get(self, request):
        if Reminder.objects.count() == 0:
            seed_all()
        reminders = Reminder.objects.all().order_by('time_str')
        serializer = ReminderSerializer(reminders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReminderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReminderDetailView(APIView):
    """Mise à jour et suppression d'un rappel."""
    def put(self, request, pk):
        try:
            reminder = Reminder.objects.get(pk=pk)
            serializer = ReminderSerializer(reminder, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Reminder.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            reminder = Reminder.objects.get(pk=pk)
            reminder.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Reminder.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class JourneyDayListView(APIView):
    """Programme guidé des 30 jours."""
    def get(self, request):
        if JourneyDay.objects.count() == 0:
            seed_all()
        days = JourneyDay.objects.all()
        serializer = JourneyDaySerializer(days, many=True)
        return Response(serializer.data)


class JourneyDayToggleView(APIView):
    """Cocher / Décocher un jour comme complété."""
    def post(self, request, day_number):
        try:
            day = JourneyDay.objects.get(day_number=day_number)
            day.completed = not day.completed
            day.save()
            return Response({"day_number": day.day_number, "completed": day.completed})
        except JourneyDay.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


from django.views import View

class DataExportView(View):
    """Exportation intégrale des données (CSV ou JSON) pour l'utilisateur."""
    def get(self, request, *args, **kwargs):
        format_type = request.GET.get('format', 'json').lower()
        profile = UserProfile.objects.first()
        cravings = CravingEvent.objects.all()
        checkins = DailyCheckIn.objects.all()
        relapses = RelapseEvent.objects.all()

        if format_type == 'csv':
            response = HttpResponse(content_type='text/csv; charset=utf-8')
            response['Content-Disposition'] = 'attachment; filename="nosmokvng_cravings_export.csv"'
            writer = csv.writer(response)
            writer.writerow(['Date/Heure', 'Déclencheur', 'Émotion', 'Intensité Avant', 'Intensité Après', 'Résultat', 'Notes'])
            for c in cravings:
                writer.writerow([
                    c.occurred_at.strftime('%Y-%m-%d %H:%M:%S'),
                    c.get_trigger_display(),
                    c.emotion,
                    c.intensity_before,
                    c.intensity_after or '',
                    c.get_outcome_display(),
                    c.notes
                ])
            return response

        # Format JSON complet
        data = {
            "exported_at": timezone.now().isoformat(),
            "profile": UserProfileSerializer(profile).data if profile else None,
            "cravings": CravingEventSerializer(cravings, many=True).data,
            "checkins": DailyCheckInSerializer(checkins, many=True).data,
            "relapses": RelapseEventSerializer(relapses, many=True).data,
        }
        return JsonResponse(data, json_dumps_params={'indent': 2})


class DataResetView(APIView):
    """Droit à l'oubli / Réinitialisation complète des données."""
    def post(self, request):
        CravingEvent.objects.all().delete()
        DailyCheckIn.objects.all().delete()
        RelapseEvent.objects.all().delete()
        JourneyDay.objects.all().update(completed=False)
        return Response({
            "success": True,
            "message": "Toutes les données de journalisation ont été purgées avec succès."
        })
