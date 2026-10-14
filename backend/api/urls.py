from django.urls import path
from .views import (
    UserProfileView,
    StatsView,
    CravingListCreateView,
    CravingDetailView,
    TodayCheckInView,
    StrategyListView,
    RelapseEventView,
    ReminderListView,
    ReminderDetailView,
    JourneyDayListView,
    JourneyDayToggleView,
    DataExportView,
    DataResetView,
)

urlpatterns = [
    # Profil & Statistiques temps réel
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('stats/', StatsView.as_view(), name='stats'),
    
    # Envies (Craving Log)
    path('cravings/', CravingListCreateView.as_view(), name='cravings_list_create'),
    path('cravings/<int:pk>/', CravingDetailView.as_view(), name='craving_detail'),
    
    # Check-in Quotidien (Matin & Soir)
    path('checkins/today/', TodayCheckInView.as_view(), name='today_checkin'),
    
    # Stratégies comportementales
    path('strategies/', StrategyListView.as_view(), name='strategies_list'),
    
    # Faux Pas & Reprise
    path('relapses/', RelapseEventView.as_view(), name='relapses'),
    
    # Rappels
    path('reminders/', ReminderListView.as_view(), name='reminders_list_create'),
    path('reminders/<int:pk>/', ReminderDetailView.as_view(), name='reminder_detail'),
    
    # Parcours 30 jours
    path('journey/', JourneyDayListView.as_view(), name='journey_list'),
    path('journey/<int:day_number>/toggle/', JourneyDayToggleView.as_view(), name='journey_toggle'),
    
    # Données, export & réinitialisation
    path('export/', DataExportView.as_view(), name='data_export'),
    path('reset/', DataResetView.as_view(), name='data_reset'),
]
