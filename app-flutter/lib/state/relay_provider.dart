import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api.dart';
import 'board_provider.dart';

class RelayStatesNotifier extends Notifier<Map<String, bool>> {
  @override
  Map<String, bool> build() {
    return {};
  }

  Future<void> fetchInitialState(String boardId) async {
    final boards = ref.read(boardListProvider);
    final nodeIp = ref.read(nodeIpProvider);
    final board = boards.where((b) => b.boardId == boardId).firstOrNull;

    if (board == null || nodeIp == null) return;

    final api = ApiService(
      nodeIp: nodeIp,
      boardId: board.boardId,
      pin: board.pin ?? '',
    );

    final isOn = await api.getRelayState();
    state = {...state, boardId: isOn};
  }

  Future<void> toggle(String boardId) async {
    final boards = ref.read(boardListProvider);
    final nodeIp = ref.read(nodeIpProvider);
    final board = boards.where((b) => b.boardId == boardId).firstOrNull;

    if (board == null || nodeIp == null) return;

    final api = ApiService(
      nodeIp: nodeIp,
      boardId: board.boardId,
      pin: board.pin ?? '',
    );

    final currentState = state[boardId] ?? false;
    final newState = !currentState;
    
    final success = await api.toggleRelay(newState);
    if (success) {
      state = {...state, boardId: newState};
    }
  }
}

final relayProvider = NotifierProvider<RelayStatesNotifier, Map<String, bool>>(RelayStatesNotifier.new);
