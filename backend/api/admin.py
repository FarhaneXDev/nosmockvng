from django.contrib import admin
from .models import (
    UserProfile,
    CravingEvent,
    DailyCheckIn,
    Strategy,
    RelapseEvent,
    Reminder,
    JourneyDay,
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'quit_start_at', 'cigarettes_per_day', 'pack_price', 'daily_cost_estimate')

@admin.register(CravingEvent)
class CravingEventAdmin(admin.ModelAdmin):
    list_display = ('occurred_at', 'trigger', 'intensity_before', 'intensity_after', 'outcome')
    list_filter = ('trigger', 'outcome')

@admin.register(DailyCheckIn)
class DailyCheckInAdmin(admin.ModelAdmin):
    list_display = ('date', 'morning_intention', 'evening_cigarettes_smoked', 'evening_cravings_managed', 'mood_rating')

@admin.register(Strategy)
class StrategyAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'duration_seconds', 'active')
    list_filter = ('category', 'active')

@admin.register(RelapseEvent)
class RelapseEventAdmin(admin.ModelAdmin):
    list_display = ('occurred_at', 'context', 'feeling', 'cigarettes_count')

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('time_str', 'title', 'context', 'enabled')
    list_filter = ('enabled', 'context')

@admin.register(JourneyDay)
class JourneyDayAdmin(admin.ModelAdmin):
    list_display = ('day_number', 'title', 'completed')
    list_filter = ('completed',)
