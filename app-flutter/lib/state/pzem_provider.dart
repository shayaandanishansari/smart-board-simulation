import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/pzem.dart';
import '../services/socket.dart';
import 'board_provider.dart';

final pzemProvider = StreamProvider.family<Pzem, String>((ref, boardId) {
  final boards = ref.watch(boardListProvider);
  final nodeIp = ref.watch(nodeIpProvider);

  final board = boards.firstWhere((b) => b.boardId == boardId, orElse: () => throw 'Board not found');

  if (nodeIp == null) {
    return Stream.value(Pzem.zero());
  }

  final socketService = SocketService(
    nodeIp: nodeIp,
    boardId: board.boardId,
    pin: board.pin ?? '',
  );

  ref.onDispose(() {
    socketService.close();
  });

  return socketService.pzemStream;
});
