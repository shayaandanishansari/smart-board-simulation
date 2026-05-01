import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/pzem_provider.dart';

class PzemDisplay extends ConsumerWidget {
  final String boardId;
  const PzemDisplay({super.key, required this.boardId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pzemAsync = ref.watch(pzemProvider(boardId));

    return pzemAsync.when(
      data: (pzem) => GridView.count(
        crossAxisCount: 2,
        shrinkWrap: true,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          _buildMetric('VOLTAGE', pzem.voltage.toStringAsFixed(1), 'V'),
          _buildMetric('CURRENT', pzem.current.toStringAsFixed(2), 'A'),
          _buildMetric('POWER', pzem.power.toStringAsFixed(0), 'W'),
          _buildMetric('ENERGY', pzem.energy.toStringAsFixed(2), 'kWh'),
        ],
      ),
      loading: () => const Center(child: CircularProgressIndicator(color: Colors.greenAccent)),
      error: (err, stack) => Center(child: Text('Error: $err', style: const TextStyle(color: Colors.redAccent))),
    );
  }

  Widget _buildMetric(String label, String value, String unit) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E26),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            label,
            style: const TextStyle(fontSize: 10, color: Colors.grey, letterSpacing: 1.5, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.greenAccent),
          ),
          Text(
            unit,
            style: const TextStyle(fontSize: 10, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
