import 'package:hive_flutter/hive_flutter.dart';
import '../models/board.dart';

class AppStorage {
  static const String _boxName = 'app_settings';
  static const String _boardsKey = 'paired_boards';

  static Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox(_boxName);
  }

  static List<Board> getPairedBoards() {
    final box = Hive.box(_boxName);
    final data = box.get(_boardsKey);
    if (data == null) return [];
    
    final List<dynamic> list = List<dynamic>.from(data);
    return list.map((item) => Board.fromJson(Map<String, dynamic>.from(item))).toList();
  }

  static Future<void> saveBoard(Board board) async {
    final box = Hive.box(_boxName);
    final boards = getPairedBoards();
    
    // Check if board already exists, if so update it, otherwise add it
    final index = boards.indexWhere((b) => b.boardId == board.boardId);
    if (index >= 0) {
      boards[index] = board;
    } else {
      boards.add(board);
    }
    
    await box.put(_boardsKey, boards.map((b) => b.toJson()).toList());
  }

  static Future<void> removeBoard(String boardId) async {
    final box = Hive.box(_boxName);
    final boards = getPairedBoards();
    boards.removeWhere((b) => b.boardId == boardId);
    await box.put(_boardsKey, boards.map((b) => b.toJson()).toList());
  }

  static Future<void> clear() async {
    final box = Hive.box(_boxName);
    await box.clear();
  }
}
