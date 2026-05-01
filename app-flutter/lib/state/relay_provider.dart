import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api.dart';
import 'board_provider.dart';

class RelayNotifier extends Notifier<bool> {
  ApiService? get _apiService {
    final board = ref.watch(boardProvider);
    final nodeIp = ref.watch(nodeIpProvider);

    if (board == null || nodeIp == null) return null;

    return ApiService(
      nodeIp: nodeIp,
      boardId: board.boardId,
      pin: board.pin ?? '',
    );
  }

  @override
  bool build() {
    _fetchInitialState();
    return false;
  }

  Future<void> _fetchInitialState() async {
    final api = _apiService;
    if (api == null) return;
    state = await api.getRelayState();
  }

  Future<void> toggle() async {
    final api = _apiService;
    if (api == null) return;
    final newState = !state;
    final success = await api.toggleRelay(newState);
    if (success) {
      state = newState;
    }
  }
}

final relayProvider = NotifierProvider<RelayNotifier, bool>(RelayNotifier.new);
