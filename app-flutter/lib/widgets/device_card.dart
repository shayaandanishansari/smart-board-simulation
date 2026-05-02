import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/board.dart';
import '../state/relay_provider.dart';
import '../state/pzem_provider.dart';

class DeviceCard extends ConsumerStatefulWidget {
  final Board board;
  final VoidCallback onTap;
  final Function(BuildContext, WidgetRef, Board) onRemove;

  const DeviceCard({
    super.key,
    required this.board,
    required this.onTap,
    required this.onRemove,
  });

  @override
  ConsumerState<DeviceCard> createState() => _DeviceCardState();
}

class _DeviceCardState extends ConsumerState<DeviceCard> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => 
      ref.read(relayProvider.notifier).fetchInitialState(widget.board.boardId)
    );
  }

  @override
  Widget build(BuildContext context) {
    final relayStates = ref.watch(relayProvider);
    final isOn = relayStates[widget.board.boardId] ?? false;
    final pzemAsync = ref.watch(pzemProvider(widget.board.boardId));

    return GestureDetector(
      onTap: widget.onTap,
      child: Card(
        margin: const EdgeInsets.only(bottom: 16),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 10,
                    height: 10,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isOn ? Colors.greenAccent : Colors.grey,
                      boxShadow: isOn ? [
                        BoxShadow(
                          color: Colors.greenAccent.withValues(alpha: 0.5),
                          blurRadius: 8,
                          spreadRadius: 2,
                        )
                      ] : [],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      widget.board.name ?? 'Device',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  Transform.scale(
                    scale: 0.8,
                    child: Switch(
                      value: isOn,
                      onChanged: (_) => ref.read(relayProvider.notifier).toggle(widget.board.boardId),
                      activeColor: Colors.white,
                      activeTrackColor: Colors.greenAccent,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.link_off, color: Colors.grey, size: 20),
                    tooltip: 'Unpair',
                    onPressed: () => widget.onRemove(context, ref, widget.board),
                  ),
                ],
              ),
              Padding(
                padding: const EdgeInsets.only(left: 22.0),
                child: Text(
                  '${isOn ? "LIVE" : "OFF"} • ${widget.board.boardId}',
                  style: TextStyle(
                    fontSize: 12,
                    color: isOn ? Colors.greenAccent.withValues(alpha: 0.7) : Colors.grey,
                    letterSpacing: 1.2,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              pzemAsync.when(
                data: (pzem) => Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildMetric('V', pzem.voltage.toStringAsFixed(1), isOn),
                    _buildMetric('A', pzem.current.toStringAsFixed(2), isOn),
                    _buildMetric('W', pzem.power.toStringAsFixed(0), isOn),
                    _buildMetric('kWh', pzem.energy.toStringAsFixed(2), isOn),
                  ],
                ),
                loading: () => const Center(child: LinearProgressIndicator()),
                error: (e, _) => Text('Error loading data', style: TextStyle(color: Colors.red[300], fontSize: 10)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetric(String unit, String value, bool isLive) {
    return Expanded(
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: isLive ? Colors.greenAccent : Colors.grey.withValues(alpha: 0.5),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            unit,
            style: const TextStyle(
              fontSize: 10,
              color: Colors.grey,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
