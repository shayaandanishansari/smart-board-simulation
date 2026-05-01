import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/relay_provider.dart';

class RelayToggle extends ConsumerWidget {
  const RelayToggle({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final relayState = ref.watch(relayProvider);

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
            value: relayState,
            onChanged: (_) {
              ref.read(relayProvider.notifier).toggle();
            },
            activeThumbImage: null, // Just to satisfy some lints if needed
            activeThumbColor: Colors.green,
            inactiveThumbColor: Colors.red,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          relayState ? 'ON' : 'OFF',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: relayState ? Colors.green : Colors.red,
          ),
        ),
      ],
    );
  }
}
