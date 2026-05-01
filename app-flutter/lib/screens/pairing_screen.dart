import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/udp.dart';
import '../state/board_provider.dart';
import '../models/board.dart';

class PairingScreen extends ConsumerStatefulWidget {
  const PairingScreen({super.key});

  @override
  ConsumerState<PairingScreen> createState() => _PairingScreenState();
}

class _PairingScreenState extends ConsumerState<PairingScreen> {
  String? _discoveredBoardId;
  final TextEditingController _pinController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _listenForPairing();
    _discoverNode();
  }

  void _discoverNode() async {
    final ip = await UdpService.discoverNode();
    if (ip != null) {
      ref.read(nodeIpProvider.notifier).setIp(ip);
    }
  }

  void _listenForPairing() async {
    await for (final boardId in UdpService.listenForPairing()) {
      if (mounted) {
        setState(() {
          _discoveredBoardId = boardId;
        });
      }
    }
  }

  void _onPair() {
    final discoveredId = _discoveredBoardId;
    if (discoveredId != null && _pinController.text.isNotEmpty) {
      final String shortId = discoveredId.length > 4 
          ? discoveredId.substring(discoveredId.length - 4) 
          : discoveredId;
          
      final board = Board(
        boardId: discoveredId,
        pin: _pinController.text,
        name: 'Board $shortId',
      );
      
      ref.read(boardListProvider.notifier).addBoard(board);
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Paired with ${board.boardId}')),
      );
      
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pairing')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: _discoveredBoardId == null
              ? const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 20),
                    Text('Waiting for pairing request from Board...'),
                    Text('Click "Pair" on the React Dashboard', style: TextStyle(color: Colors.grey)),
                  ],
                )
              : Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Found Board: $_discoveredBoardId',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 20),
                    TextField(
                      controller: _pinController,
                      decoration: const InputDecoration(
                        labelText: 'Enter PIN',
                        border: OutlineInputBorder(),
                        hintText: 'PIN shown on React screen',
                      ),
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: _onPair,
                      child: const Text('Pair Board'),
                    ),
                    TextButton(
                      onPressed: () => setState(() => _discoveredBoardId = null),
                      child: const Text('Cancel'),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
