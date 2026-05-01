import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/board.dart';
import '../storage/app_storage.dart';

class BoardNotifier extends Notifier<Board?> {
  @override
  Board? build() {
    return AppStorage.getPairedBoard();
  }

  void setBoard(Board board) {
    state = board;
    AppStorage.savePairedBoard(board);
  }

  void clear() {
    state = null;
    AppStorage.clear();
  }
}

final boardProvider = NotifierProvider<BoardNotifier, Board?>(BoardNotifier.new);

class NodeIpNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void setIp(String? ip) => state = ip;
}

final nodeIpProvider = NotifierProvider<NodeIpNotifier, String?>(NodeIpNotifier.new);
