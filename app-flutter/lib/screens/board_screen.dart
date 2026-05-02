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
      backgroundColor: const Color(0xFF12121A),
      appBar: AppBar(
        title: Text(board.name ?? 'Device Details'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
            tooltip: 'Unpair Board',
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  backgroundColor: const Color(0xFF1E1E26),
                  title: const Text('Unpair Board?'),
                  content: Text('Do you want to unpair ${board.boardId}?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                    TextButton(
                      onPressed: () {
                        ref.read(boardListProvider.notifier).removeBoard(board.boardId);
                        ref.read(selectedBoardProvider.notifier).select(null);
                        Navigator.pop(context); // Close dialog
                        Navigator.pop(context); // Go back to dashboard
                      },
                      child: const Text('Unpair', style: TextStyle(color: Colors.redAccent)),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            const ConnectionStatus(),
            const SizedBox(height: 40),
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: const Color(0xFF1E1E26),
                borderRadius: BorderRadius.circular(24),
              ),
              child: RelayToggle(boardId: board.boardId),
            ),
            const SizedBox(height: 40),
            const Row(
              children: [
                Text(
                  'LIVE CONSUMPTION',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                    letterSpacing: 2,
                  ),
                ),
                Spacer(),
                Icon(Icons.bolt, color: Colors.greenAccent, size: 16),
              ],
            ),
            const SizedBox(height: 16),
            PzemDisplay(boardId: board.boardId),
          ],
        ),
      ),
    );
  }
}
