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
        physics: const NeverScrollableScrollPhysics(),
        children: [
          _buildMetric('Voltage', '${pzem.voltage.toStringAsFixed(1)} V', Colors.blue),
          _buildMetric('Current', '${pzem.current.toStringAsFixed(2)} A', Colors.orange),
          _buildMetric('Power', '${pzem.power.toStringAsFixed(1)} W', Colors.purple),
          _buildMetric('Energy', '${pzem.energy.toStringAsFixed(3)} kWh', Colors.green),
        ],
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (err, stack) => Center(child: Text('Error: $err')),
    );
  }

  Widget _buildMetric(String label, String value, Color color) {
    return Card(
      elevation: 4,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(label, style: const TextStyle(fontSize: 14, color: Colors.grey)),
          const SizedBox(height: 5),
          Text(
            value,
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color),
          ),
        ],
      ),
    );
  }
}
