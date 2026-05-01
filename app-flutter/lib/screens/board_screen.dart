import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/board_provider.dart';
import '../widgets/relay_toggle.dart';
import '../widgets/pzem_display.dart';
import '../widgets/connection_status.dart';

class BoardScreen extends ConsumerWidget {
  const BoardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final board = ref.watch(selectedBoardProvider);
    
    if (board == null) {
      return const Scaffold(body: Center(child: Text("No board selected")));
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Board: ${board.boardId}'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            const ConnectionStatus(),
            const SizedBox(height: 30),
            RelayToggle(boardId: board.boardId),
            const SizedBox(height: 30),
            const Divider(),
            const SizedBox(height: 20),
            const Text(
              'Live Consumption',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            PzemDisplay(boardId: board.boardId),
          ],
        ),
      ),
    );
  }
}
