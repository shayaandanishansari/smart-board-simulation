import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/board.dart';
import '../storage/app_storage.dart';

class BoardListNotifier extends Notifier<List<Board>> {
  @override
  List<Board> build() {
    return AppStorage.getPairedBoards();
  }

  void addBoard(Board board) {
    state = [...state.where((b) => b.boardId != board.boardId), board];
    AppStorage.saveBoard(board);
  }

  void removeBoard(String boardId) {
    state = state.where((b) => b.boardId != boardId).toList();
    AppStorage.removeBoard(boardId);
  }

  void clear() {
    state = [];
    AppStorage.clear();
  }
}

final boardListProvider = NotifierProvider<BoardListNotifier, List<Board>>(BoardListNotifier.new);

class SelectedBoardNotifier extends Notifier<Board?> {
  @override
  Board? build() => null;

  void select(Board? board) => state = board;
}

final selectedBoardProvider = NotifierProvider<SelectedBoardNotifier, Board?>(SelectedBoardNotifier.new);

class NodeIpNotifier extends Notifier<String?> {
  @override
  String? build() => null;

  void setIp(String? ip) => state = ip;
}

final nodeIpProvider = NotifierProvider<NodeIpNotifier, String?>(NodeIpNotifier.new);
