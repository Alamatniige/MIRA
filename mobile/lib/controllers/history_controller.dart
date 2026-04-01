import '../models/activity.dart';
import '../repositories/history_repository.dart';

class HistoryController {
  HistoryController({HistoryRepository? historyRepository})
    : _historyRepository = historyRepository ?? HistoryRepository();

  final HistoryRepository _historyRepository;

  List<ActivityItem> _items = [];
  String currentFilter = 'all';
  String searchQuery = '';
  String sortBy = 'date';
  bool sortAscending = false;

  Future<List<ActivityItem>> loadHistory(String filter) async {
    currentFilter = filter;
    if (filter == 'all') {
      _items = await _historyRepository.getHistoryAll();
    } else if (filter == 'assigned') {
      _items = await _historyRepository.getHistoryAssigned();
    } else if (filter == 'reported') {
      _items = await _historyRepository.getHistoryReported();
    }
    return getFilteredAndSortedItems();
  }

  void setSearchQuery(String query) {
    searchQuery = query.trim();
  }

  void setSort(String field, bool ascending) {
    sortBy = field;
    sortAscending = ascending;
  }

  List<ActivityItem> getFilteredAndSortedItems() {
    var filtered = _items.where((item) {
      if (searchQuery.isEmpty) return true;
      final query = searchQuery.toLowerCase();
      return item.assetName.toLowerCase().contains(query) ||
             item.action.toLowerCase().contains(query) ||
             item.assetId.toLowerCase().contains(query);
    }).toList();

    filtered.sort((a, b) {
      int cmp;
      if (sortBy == 'name') {
        cmp = a.assetName.toLowerCase().compareTo(b.assetName.toLowerCase());
      } else {
        cmp = a.dateTime.compareTo(b.dateTime);
      }
      return sortAscending ? cmp : -cmp;
    });

    return filtered;
  }
}
