import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/board_provider.dart';
import 'board_screen.dart';
import 'pairing_screen.dart';
import '../models/board.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final List<Board> boards = ref.watch(boardListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('SmartBoard Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.invalidate(boardListProvider),
          ),
        ],
      ),
      body: boards.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('No boards paired yet'),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const PairingScreen()),
                    ),
                    child: const Text('Pair First Board'),
                  ),
                ],
              ),
            )
          : ListView.builder(
              itemCount: boards.length,
              padding: const EdgeInsets.all(16),
              itemBuilder: (context, index) {
                final board = boards[index];
                final String displayName = board.name ?? 'Unnamed Board';
                
                return Card(
                  child: ListTile(
                    title: Text(displayName),
                    subtitle: Text('ID: ${board.boardId}'),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      ref.read(selectedBoardProvider.notifier).select(board);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const BoardScreen()),
                      );
                    },
                    onLongPress: () {
                      _showRemoveDialog(context, ref, board);
                    },
                  ),
                );
              },
            ),
      floatingActionButton: boards.isNotEmpty
          ? FloatingActionButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const PairingScreen()),
              ),
              child: const Icon(Icons.add),
            )
          : null,
    );
  }

  void _showRemoveDialog(BuildContext context, WidgetRef ref, Board board) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove Board?'),
        content: Text('Do you want to unpair ${board.boardId}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              ref.read(boardListProvider.notifier).removeBoard(board.boardId);
              Navigator.pop(context);
            },
            child: const Text('Remove', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}
