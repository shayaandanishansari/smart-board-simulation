import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/relay_provider.dart';

class RelayToggle extends ConsumerStatefulWidget {
  final String boardId;
  const RelayToggle({super.key, required this.boardId});

  @override
  ConsumerState<RelayToggle> createState() => _RelayToggleState();
}

class _RelayToggleState extends ConsumerState<RelayToggle> {
  @override
  void initState() {
    super.initState();
    // Fetch initial state when widget is first built
    Future.microtask(() => 
      ref.read(relayProvider.notifier).fetchInitialState(widget.boardId)
    );
  }

  @override
  Widget build(BuildContext context) {
    final relayStates = ref.watch(relayProvider);
    final isOn = relayStates[widget.boardId] ?? false;

    return Column(
      children: [
        const Text(
          'Relay Control',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        Transform.scale(
          scale: 2.0,
          child: Switch(
            value: isOn,
            onChanged: (_) {
              ref.read(relayProvider.notifier).toggle(widget.boardId);
            },
            activeThumbColor: Colors.green,
            inactiveThumbColor: Colors.red,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          isOn ? 'ON' : 'OFF',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: isOn ? Colors.green : Colors.red,
          ),
        ),
      ],
    );
  }
}
