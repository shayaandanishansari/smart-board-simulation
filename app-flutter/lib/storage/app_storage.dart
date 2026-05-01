import 'package:hive_flutter/hive_flutter.dart';
import '../models/board.dart';

class AppStorage {
  static const String _boxName = 'app_settings';
  static const String _boardKey = 'paired_board';

  static Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox(_boxName);
  }

  static Board? getPairedBoard() {
    final box = Hive.box(_boxName);
    final data = box.get(_boardKey);
    if (data == null) return null;
    return Board.fromJson(Map<String, dynamic>.from(data));
  }

  static Future<void> savePairedBoard(Board board) async {
    final box = Hive.box(_boxName);
    await box.put(_boardKey, board.toJson());
  }

  static Future<void> clear() async {
    final box = Hive.box(_boxName);
    await box.clear();
  }
}
