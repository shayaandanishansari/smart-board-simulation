import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/board_provider.dart';

class ConnectionStatus extends ConsumerWidget {
  const ConnectionStatus({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final nodeIp = ref.watch(nodeIpProvider);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: nodeIp != null ? Colors.green.withValues(alpha: 0.1) : Colors.red.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: nodeIp != null ? Colors.green : Colors.red,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            nodeIp != null ? Icons.link : Icons.link_off,
            size: 16,
            color: nodeIp != null ? Colors.green : Colors.red,
          ),
          const SizedBox(width: 8),
          Text(
            nodeIp ?? 'Not Connected',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: nodeIp != null ? Colors.green : Colors.red,
            ),
          ),
        ],
      ),
    );
  }
}
