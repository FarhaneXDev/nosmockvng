from rest_framework import serializers
from .models import (
    UserProfile,
    CravingEvent,
    DailyCheckIn,
    Strategy,
    RelapseEvent,
    Reminder,
    JourneyDay
)

class UserProfileSerializer(serializers.ModelSerializer):
    daily_cost_estimate = serializers.ReadOnlyField()

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'created_at',
            'updated_at',
            'cigarettes_per_day',
            'smoking_duration_years',
            'first_cigarette_delay_minutes',
            'pack_price',
            'currency',
            'cigarettes_per_pack',
            'quit_start_at',
            'triggers',
            'trusted_contact_name',
            'trusted_contact_phone',
            'reminder_preferences',
            'privacy_consent',
            'daily_cost_estimate',
        ]


class CravingEventSerializer(serializers.ModelSerializer):
    trigger_display = serializers.CharField(source='get_trigger_display', read_only=True)
    outcome_display = serializers.CharField(source='get_outcome_display', read_only=True)

    class Meta:
        model = CravingEvent
        fields = [
            'id',
            'created_at',
            'occurred_at',
            'trigger',
            'trigger_display',
            'emotion',
            'intensity_before',
            'intensity_after',
            'strategies_used',
            'outcome',
            'outcome_display',
            'notes',
            'duration_seconds',
        ]


class DailyCheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyCheckIn
        fields = [
            'id',
            'date',
            'morning_intention',
            'morning_risk',
            'morning_strategy',
            'evening_cigarettes_smoked',
            'evening_cravings_managed',
            'mood_rating',
            'money_saved_estimate',
            'evening_learning',
            'evening_adjustment',
        ]


class StrategySerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Strategy
        fields = [
            'id',
            'slug',
            'title',
            'category',
            'category_display',
            'trigger_tags',
            'short_description',
            'instructions',
            'duration_seconds',
            'evidence_note',
            'safety_note',
            'active',
            'icon_name',
        ]


class RelapseEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = RelapseEvent
        fields = [
            'id',
            'occurred_at',
            'context',
            'feeling',
            'what_happened_before',
            'helpful_action_next_time',
            'next_action_immediate',
            'cigarettes_count',
        ]


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = [
            'id',
            'time_str',
            'title',
            'message',
            'context',
            'enabled',
        ]


class JourneyDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = JourneyDay
        fields = [
            'id',
            'day_number',
            'phase_title',
            'title',
            'summary',
            'action_today',
            'mantra',
            'completed',
        ]
