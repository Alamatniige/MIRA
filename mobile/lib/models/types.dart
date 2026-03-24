typedef Department = String;
typedef AssetStatus = String;
typedef NotificationType = String;

class AuthUser {
  const AuthUser({
    required this.id,
    required this.email,
    required this.fullName,
    required this.department,
    required this.roleName,
  });

  final String id;
  final String email;
  final String fullName;
  final String department;
  final String roleName;

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    final role = _asMap(json['role']);
    return AuthUser(
      id: _asString(json['id']),
      email: _asString(json['email']),
      fullName: _asString(json['fullName']),
      department: _asString(json['department']),
      roleName: _asString(json['roleName']).isNotEmpty
          ? _asString(json['roleName'])
          : _asString(role['name']),
    );
  }
}

class UserRole {
  const UserRole({required this.name});

  final String name;

  factory UserRole.fromJson(Map<String, dynamic> json) {
    return UserRole(name: _asString(json['name']));
  }
}

class UserProfile {
  const UserProfile({
    required this.id,
    required this.email,
    required this.fullName,
    required this.department,
    required this.roleName,
    required this.phoneNumber,
    required this.assetsCount,
  });

  final String id;
  final String email;
  final String fullName;
  final String department;
  final String roleName;
  final String phoneNumber;
  final int assetsCount;

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    final role = _asMap(json['role']);
    return UserProfile(
      id: _asString(json['id']),
      email: _asString(json['email']),
      fullName: _asString(json['fullName']),
      department: _asString(json['department']),
      roleName: _asString(role['name']),
      phoneNumber: _asString(json['phoneNumber']),
      assetsCount: _asInt(json['assetsCount']),
    );
  }
}

class AssetType {
  const AssetType({
    required this.id,
    required this.name,
    required this.createdAt,
  });

  final int id;
  final String name;
  final String createdAt;

  factory AssetType.fromJson(Map<String, dynamic> json) {
    return AssetType(
      id: _asInt(json['id']),
      name: _asString(json['name']),
      createdAt: _asDateString(json, 'createdAt'),
    );
  }
}

class AssetRoom {
  const AssetRoom({
    required this.id,
    required this.name,
    required this.createdAt,
    this.floorId,
    this.x,
    this.y,
    this.width,
    this.height,
  });

  final int id;
  final String name;
  final String createdAt;
  final int? floorId;
  final double? x;
  final double? y;
  final double? width;
  final double? height;

  factory AssetRoom.fromJson(Map<String, dynamic> json) {
    return AssetRoom(
      id: _asInt(json['id']),
      name: _asString(json['name']),
      createdAt: _asDateString(json, 'createdAt'),
      floorId: _asNullableInt(json['floorId']),
      x: _asNullableDouble(json['x']),
      y: _asNullableDouble(json['y']),
      width: _asNullableDouble(json['width']),
      height: _asNullableDouble(json['height']),
    );
  }
}

class AssetFloor {
  const AssetFloor({
    required this.id,
    required this.name,
    required this.createdAt,
    this.level,
  });

  final int id;
  final String name;
  final String createdAt;
  final int? level;

  factory AssetFloor.fromJson(Map<String, dynamic> json) {
    return AssetFloor(
      id: _asInt(json['id']),
      name: _asString(json['name']),
      createdAt: _asDateString(json, 'createdAt'),
      level: _asNullableInt(json['level']),
    );
  }
}

class FloorMapRoom {
  const FloorMapRoom({
    required this.roomId,
    required this.roomName,
    required this.x,
    required this.y,
    required this.width,
    required this.height,
    required this.assetCount,
  });

  final int roomId;
  final String roomName;
  final double x;
  final double y;
  final double width;
  final double height;
  final int assetCount;

  factory FloorMapRoom.fromJson(Map<String, dynamic> json) {
    return FloorMapRoom(
      roomId: _asInt(json['roomId']),
      roomName: _asString(json['roomName']),
      x: _asDouble(json['x']),
      y: _asDouble(json['y']),
      width: _asDouble(json['width']),
      height: _asDouble(json['height']),
      assetCount: _asInt(json['assetCount']),
    );
  }
}

class FloorMap {
  const FloorMap({
    required this.floorId,
    required this.floorName,
    required this.level,
    required this.rooms,
  });

  final int floorId;
  final String floorName;
  final int level;
  final List<FloorMapRoom> rooms;

  factory FloorMap.fromJson(Map<String, dynamic> json) {
    final rooms = json['rooms'] as List<dynamic>? ?? const [];
    return FloorMap(
      floorId: _asInt(json['floorId']),
      floorName: _asString(json['floorName']),
      level: _asInt(json['level']),
      rooms: rooms
          .whereType<Map<String, dynamic>>()
          .map(FloorMapRoom.fromJson)
          .toList(),
    );
  }
}

class IssueReport {
  const IssueReport({
    required this.id,
    required this.assetId,
    required this.assetTag,
    required this.assetName,
    required this.reportedBy,
    required this.userName,
    required this.description,
    required this.status,
    required this.reportAt,
  });

  final String id;
  final String assetId;
  final String assetTag;
  final String assetName;
  final String reportedBy;
  final String userName;
  final String description;
  final String status;
  final String reportAt;

  factory IssueReport.fromJson(Map<String, dynamic> json) {
    return IssueReport(
      id: _asString(json['id']),
      assetId: _asString(json['assetId']),
      assetTag: _asString(json['assetTag']),
      assetName: _asString(json['assetName']),
      reportedBy: _asString(json['reportedBy']),
      userName: _asString(json['userName']),
      description: _asString(json['description']),
      status: _asString(json['status']),
      reportAt: _asString(json['reportAt']),
    );
  }
}

class Assets {
  const Assets({
    required this.id,
    required this.tag,
    required this.assetName,
    required this.assetType,
    this.assetTypeRel,
    required this.serialNumber,
    required this.specification,
    required this.room,
    this.roomRel,
    required this.floor,
    this.floorRel,
    required this.currentStatus,
    required this.isAssigned,
    required this.createdAt,
    required this.image,
    this.assignedTo,
    this.qrCodeUrl,
    this.updatedAt,
  });

  final String id;
  final String tag;
  final String assetName;
  final int? assetType;
  final AssetType? assetTypeRel;
  final String serialNumber;
  final String specification;
  final int? room;
  final AssetRoom? roomRel;
  final int? floor;
  final AssetFloor? floorRel;
  final String currentStatus;
  final bool isAssigned;
  final String createdAt;
  final List<String> image;
  final String? assignedTo;
  final String? qrCodeUrl;
  final String? updatedAt;

  factory Assets.fromJson(Map<String, dynamic> json) {
    final assetTypeRel = _asMap(json['assetTypeRel']);
    final roomRel = _asMap(json['roomRel']);
    final floorRel = _asMap(json['floorRel']);

    return Assets(
      id: _asString(json['id']),
      tag: _asString(json['tag']),
      assetName: _asString(json['assetName']),
      assetType: _asNullableInt(json['assetType']),
      assetTypeRel: assetTypeRel.isEmpty
          ? null
          : AssetType.fromJson(assetTypeRel),
      serialNumber: _asString(json['serialNumber']),
      specification: _asString(json['specification']),
      room: _asNullableInt(json['room']),
      roomRel: roomRel.isEmpty ? null : AssetRoom.fromJson(roomRel),
      floor: _asNullableInt(json['floor']),
      floorRel: floorRel.isEmpty ? null : AssetFloor.fromJson(floorRel),
      currentStatus: _asString(json['currentStatus']),
      isAssigned: _asBool(json['isAssigned']),
      createdAt: _asDateString(json, 'createdAt'),
      image: _asStringList(json['image']),
      assignedTo: _asNullableString(json['assignedTo']),
      qrCodeUrl: _asNullableString(json['qrCodeUrl']),
      updatedAt: _asNullableDateString(json, 'updatedAt'),
    );
  }
}

class Assignment {
  const Assignment({
    required this.id,
    required this.assetId,
    required this.assetTag,
    required this.assetName,
    required this.assignee,
    this.issuedByUserId,
    this.issuerName,
    required this.department,
    required this.status,
    this.notes,
    required this.assignedAt,
    this.returnedAt,
    this.rejectedAt,
    this.rejectedByUserId,
    this.rejectionReason,
  });

  final String id;
  final String assetId;
  final String assetTag;
  final String assetName;
  final String assignee;
  final String? issuedByUserId;
  final String? issuerName;
  final Department department;
  final String status;
  final String? notes;
  final String assignedAt;
  final String? returnedAt;
  final String? rejectedAt;
  final String? rejectedByUserId;
  final String? rejectionReason;

  factory Assignment.fromJson(Map<String, dynamic> json) {
    return Assignment(
      id: _asString(json['id']),
      assetId: _asString(json['assetId']),
      assetTag: _asString(json['assetTag']),
      assetName: _asString(json['assetName']),
      assignee: _asString(json['assignee']),
      issuedByUserId: _asNullableString(json['issuedByUserId']),
      issuerName: _asNullableString(json['issuerName']),
      department: _asString(json['department']),
      status: _asString(json['status']),
      notes: _asNullableString(json['notes']),
      assignedAt: _asString(json['assignedAt']),
      returnedAt: _asNullableDateString(json, 'returnedAt'),
      rejectedAt: _asNullableDateString(json, 'rejectedAt'),
      rejectedByUserId: _asNullableString(json['rejectedByUserId']),
      rejectionReason: _asNullableString(json['rejectionReason']),
    );
  }
}

class MaintenanceEvent {
  const MaintenanceEvent({
    required this.id,
    required this.assetId,
    required this.type,
    required this.openedAt,
    this.closedAt,
    this.vendor,
    this.notes,
  });

  final String id;
  final String assetId;
  final String type;
  final String openedAt;
  final String? closedAt;
  final String? vendor;
  final String? notes;

  factory MaintenanceEvent.fromJson(Map<String, dynamic> json) {
    return MaintenanceEvent(
      id: _asString(json['id']),
      assetId: _asString(json['assetId']),
      type: _asString(json['type']),
      openedAt: _asString(json['openedAt']),
      closedAt: _asNullableDateString(json, 'closedAt'),
      vendor: _asNullableString(json['vendor']),
      notes: _asNullableString(json['notes']),
    );
  }
}

class UtilizationSummary {
  const UtilizationSummary({
    required this.utilizationRate,
    required this.activeAssetCount,
    required this.totalAssetCount,
  });

  final double utilizationRate;
  final int activeAssetCount;
  final int totalAssetCount;

  factory UtilizationSummary.fromJson(Map<String, dynamic> json) {
    return UtilizationSummary(
      utilizationRate: _asDouble(json['utilizationRate']),
      activeAssetCount: _asInt(json['activeAssetCount']),
      totalAssetCount: _asInt(json['totalAssetCount']),
    );
  }
}

class DepartmentDistribution {
  const DepartmentDistribution({
    required this.department,
    required this.assetCount,
    required this.percentage,
  });

  final Department department;
  final int assetCount;
  final double percentage;

  factory DepartmentDistribution.fromJson(Map<String, dynamic> json) {
    return DepartmentDistribution(
      department: _asString(json['department']),
      assetCount: _asInt(json['assetCount']),
      percentage: _asDouble(json['percentage']),
    );
  }
}

class MovementPoint {
  const MovementPoint({
    required this.month,
    required this.assignments,
    required this.returns,
    required this.maintenanceTransfers,
  });

  final String month;
  final int assignments;
  final int returns;
  final int maintenanceTransfers;

  factory MovementPoint.fromJson(Map<String, dynamic> json) {
    return MovementPoint(
      month: _asString(json['month']),
      assignments: _asInt(json['assignments']),
      returns: _asInt(json['returns']),
      maintenanceTransfers: _asInt(json['maintenanceTransfers']),
    );
  }
}

class UserModel {
  const UserModel({
    required this.id,
    required this.email,
    required this.fullName,
    required this.department,
    required this.phoneNumber,
    this.role,
    this.status,
    this.lastActive,
    this.assetsCount,
  });

  final String id;
  final String email;
  final String fullName;
  final String department;
  final String phoneNumber;
  final UserRole? role;
  final String? status;
  final String? lastActive;
  final int? assetsCount;

  factory UserModel.fromJson(Map<String, dynamic> json) {
    final role = _asMap(json['role']);
    return UserModel(
      id: _asString(json['id']),
      email: _asString(json['email']),
      fullName: _asString(json['fullName']),
      department: _asString(json['department']),
      phoneNumber: _asString(json['phoneNumber']),
      role: role.isEmpty ? null : UserRole.fromJson(role),
      status: _asNullableString(json['status']),
      lastActive: _asNullableDateString(json, 'lastActive'),
      assetsCount: _asNullableInt(json['assetsCount']),
    );
  }
}

class AppNotification {
  const AppNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.description,
    required this.performedBy,
    required this.read,
    required this.createdAt,
  });

  final String id;
  final NotificationType type;
  final String title;
  final String description;
  final String performedBy;
  final bool read;
  final String createdAt;

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: _asString(json['id']),
      type: _asString(json['type']),
      title: _asString(json['title']),
      description: _asString(json['description']),
      performedBy: _asString(json['performedBy']),
      read: _asBool(json['read']),
      createdAt: _asDateString(json, 'createdAt'),
    );
  }
}

String _asString(dynamic value) {
  if (value == null) {
    return '';
  }
  return value.toString();
}

String? _asNullableString(dynamic value) {
  if (value == null) {
    return null;
  }
  final stringValue = value.toString();
  return stringValue.isEmpty ? null : stringValue;
}

int _asInt(dynamic value) {
  if (value is int) {
    return value;
  }
  if (value is num) {
    return value.toInt();
  }
  if (value is String) {
    return int.tryParse(value) ?? 0;
  }
  return 0;
}

int? _asNullableInt(dynamic value) {
  if (value == null) {
    return null;
  }
  if (value is int) {
    return value;
  }
  if (value is num) {
    return value.toInt();
  }
  if (value is String && value.isNotEmpty) {
    return int.tryParse(value);
  }
  return null;
}

double _asDouble(dynamic value) {
  if (value is double) {
    return value;
  }
  if (value is num) {
    return value.toDouble();
  }
  if (value is String) {
    return double.tryParse(value) ?? 0;
  }
  return 0;
}

double? _asNullableDouble(dynamic value) {
  if (value == null) {
    return null;
  }
  if (value is double) {
    return value;
  }
  if (value is num) {
    return value.toDouble();
  }
  if (value is String && value.isNotEmpty) {
    return double.tryParse(value);
  }
  return null;
}

bool _asBool(dynamic value) {
  if (value is bool) {
    return value;
  }
  if (value is num) {
    return value != 0;
  }
  if (value is String) {
    final normalized = value.trim().toLowerCase();
    return normalized == 'true' || normalized == '1' || normalized == 'yes';
  }
  return false;
}

List<String> _asStringList(dynamic value) {
  if (value is List) {
    return value.map((item) => item.toString()).toList();
  }
  if (value is String && value.isNotEmpty) {
    return <String>[value];
  }
  return const <String>[];
}

Map<String, dynamic> _asMap(dynamic value) {
  if (value is Map<String, dynamic>) {
    return value;
  }
  return const <String, dynamic>{};
}

String _asDateString(Map<String, dynamic> json, String key) {
  final value = json[key] ?? json[_legacyDateKey(key)];
  return _asString(value);
}

String? _asNullableDateString(Map<String, dynamic> json, String key) {
  final value = json[key] ?? json[_legacyDateKey(key)];
  return _asNullableString(value);
}

String _legacyDateKey(String key) {
  if (!key.startsWith('created') && !key.startsWith('updated')) {
    return key;
  }
  return key.replaceFirst('ed', '');
}
