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
          'RELAY CONTROL',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 2),
        ),
        const SizedBox(height: 24),
        Transform.scale(
          scale: 2.5,
          child: Switch(
            value: isOn,
            onChanged: (_) {
              ref.read(relayProvider.notifier).toggle(widget.boardId);
            },
            activeColor: Colors.white,
            activeTrackColor: Colors.greenAccent,
            inactiveThumbColor: Colors.grey[400],
            inactiveTrackColor: Colors.grey[800],
          ),
        ),
        const SizedBox(height: 32),
        Text(
          isOn ? 'ACTIVE' : 'INACTIVE',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
            color: isOn ? Colors.greenAccent : Colors.grey[600],
          ),
        ),
      ],
    );
  }
}
