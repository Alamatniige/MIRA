mobile/lib/

core/config/ [`DONE`]
app_config.dart

network/ [`DONE`]
api_client.dart
api_exception.dart

storage/ [`DONE`]
token_storage.dart

services/ [`IN-PROGRESS`]
auth_service.dart
asset_service.dart
assignment_service.dart
user_service.dart
notification_service.dart
qr_service.dart

repositories/
auth_repository.dart
asset_repository.dart
assignment_repository.dart
user_repository.dart
notification_repository.dart

models/
asset.dart
activity.dart
auth_user.dart

dto/
asset_response_dto.dart
login_response_dto.dart

controllers/
dashboard_controller.dart
assets_controller.dart
home_controller.dart
login_controller.dart

views/
widgets/
theme/

main.dart

============================================================

core/config
Holds environment values like API base URL, timeout, and flags. One source of truth for app-wide config.

core/network
Shared HTTP logic. This is where headers, bearer token injection, status-code handling, and JSON parsing are centralized.

core/storage
Persistent app storage wrappers (token/session). Keeps secure/local storage usage away from UI code.

services
Raw endpoint callers. Example: AuthService calls /login, AssetService calls /assets. Services know transport details, not UI/business flow.

repositories
App-level data access. Repositories combine one or more services, map DTOs to models, and hide where data came from (API/mock/cache).

models
Domain models used by controllers/views. Keep app-facing clean models here.

models/dto
API response/request shapes. This avoids polluting domain models with backend-specific fields.

controllers
Screen state and user actions only. Controllers should call repositories, not build URLs or parse response maps.

views/widgets/theme
UI only. No direct HTTP calls.
