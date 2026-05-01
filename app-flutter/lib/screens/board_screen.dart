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
    final board = ref.watch(boardProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('Board: ${board?.boardId ?? "Unknown"}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => ref.read(boardProvider.notifier).clear(),
          ),
        ],
      ),
      body: const SingleChildScrollView(
        padding: EdgeInsets.all(20.0),
        child: Column(
          children: [
            ConnectionStatus(),
            SizedBox(height: 30),
            RelayToggle(),
            SizedBox(height: 30),
            Divider(),
            SizedBox(height: 20),
            Text(
              'Live Consumption',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            PzemDisplay(),
          ],
        ),
      ),
    );
  }
}
