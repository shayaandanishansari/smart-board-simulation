import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/board_provider.dart';

class ConnectionStatus extends ConsumerWidget {
  const ConnectionStatus({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final nodeIp = ref.watch(nodeIpProvider);
    final isConnected = nodeIp != null;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: (isConnected ? Colors.greenAccent : Colors.redAccent).withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: (isConnected ? Colors.greenAccent : Colors.redAccent).withValues(alpha: 0.2),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isConnected ? Colors.greenAccent : Colors.redAccent,
              boxShadow: isConnected ? [
                BoxShadow(
                  color: Colors.greenAccent.withValues(alpha: 0.4),
                  blurRadius: 4,
                  spreadRadius: 1,
                )
              ] : [],
            ),
          ),
          const SizedBox(width: 12),
          Text(
            isConnected ? 'HUB AT $nodeIp' : 'HUB OFFLINE',
            style: TextStyle(
              fontSize: 10,
              letterSpacing: 1.5,
              fontWeight: FontWeight.bold,
              color: isConnected ? Colors.greenAccent : Colors.redAccent,
            ),
          ),
        ],
      ),
    );
  }
}
