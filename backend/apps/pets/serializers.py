from rest_framework import serializers
from .models import Pet, PetGender


class PetSerializer(serializers.ModelSerializer):
    """
    Serializer cho CRUD hồ sơ Thú cưng.
    """
    owner_username = serializers.ReadOnlyField(source='owner.username')
    owner_name = serializers.ReadOnlyField(source='owner.get_full_name')
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)

    class Meta:
        model = Pet
        fields = (
            'id',
            'owner',
            'owner_username',
            'owner_name',
            'name',
            'species',
            'breed',
            'gender',
            'gender_display',
            'birth_date',
            'weight',
            'notes',
            'avatar',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

    def create(self, validated_data):
        # Tự động gán người dùng hiện tại làm chủ sở hữu
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['owner'] = request.user
        return super().create(validated_data)

