/// Asset model - matches web Asset structure
class Asset {
  final String id;
  final String uuid;
  final String name;
  final String category;
  final String serialNumber;
  final String specifications;
  final String location;
  final String status;
  final String? assignedTo;
  final String? assignedToId;
  final String purchaseDate;
  final String warrantyExpiry;
  final List<String> images;

  const Asset({
    required this.id,
    required this.uuid,
    required this.name,
    required this.category,
    required this.serialNumber,
    required this.specifications,
    required this.location,
    required this.status,
    this.assignedTo,
    this.assignedToId,
    required this.purchaseDate,
    required this.warrantyExpiry,
    this.images = const [],
  });

  Asset copyWith({
    String? id,
    String? uuid,
    String? name,
    String? category,
    String? serialNumber,
    String? specifications,
    String? location,
    String? status,
    String? assignedTo,
    String? assignedToId,
    String? purchaseDate,
    String? warrantyExpiry,
    List<String>? images,
  }) {
    return Asset(
      id: id ?? this.id,
      uuid: uuid ?? this.uuid,
      name: name ?? this.name,
      category: category ?? this.category,
      serialNumber: serialNumber ?? this.serialNumber,
      specifications: specifications ?? this.specifications,
      location: location ?? this.location,
      status: status ?? this.status,
      assignedTo: assignedTo ?? this.assignedTo,
      assignedToId: assignedToId ?? this.assignedToId,
      purchaseDate: purchaseDate ?? this.purchaseDate,
      warrantyExpiry: warrantyExpiry ?? this.warrantyExpiry,
      images: images ?? this.images,
    );
  }
}
