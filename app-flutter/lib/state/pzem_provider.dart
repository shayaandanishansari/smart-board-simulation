import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/pzem.dart';
import '../services/socket.dart';
import 'board_provider.dart';

final pzemProvider = StreamProvider<Pzem>((ref) {
  final board = ref.watch(boardProvider);
  final nodeIp = ref.watch(nodeIpProvider);

  if (board == null || nodeIp == null) {
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
