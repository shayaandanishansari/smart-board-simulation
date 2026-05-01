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
        SnackBar(
          content: Text('Paired with ${board.boardId}'),
          backgroundColor: Colors.greenAccent,
          behavior: SnackBarBehavior.floating,
        ),
      );
      
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('New Device'),
        backgroundColor: Colors.transparent,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32.0),
          child: _discoveredBoardId == null
              ? Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const CircularProgressIndicator(color: Colors.greenAccent),
                    const SizedBox(height: 32),
                    const Text(
                      'SCANNING FOR DEVICES',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey,
                        letterSpacing: 2,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Click "Pair" on the React Dashboard',
                      style: TextStyle(color: Colors.grey, fontSize: 14),
                      textAlign: TextAlign.center,
                    ),
                  ],
                )
              : Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'DEVICE FOUND',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.greenAccent,
                        letterSpacing: 2,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _discoveredBoardId!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 48),
                    TextField(
                      controller: _pinController,
                      decoration: InputDecoration(
                        labelText: 'ENTER PIN',
                        labelStyle: const TextStyle(fontSize: 12, letterSpacing: 1),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: Colors.grey),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: Colors.greenAccent),
                        ),
                        hintText: 'PIN from React screen',
                      ),
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 20, letterSpacing: 4),
                    ),
                    const SizedBox(height: 32),
                    ElevatedButton(
                      onPressed: _onPair,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.greenAccent,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('PAIR DEVICE', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(height: 16),
                    TextButton(
                      onPressed: () => setState(() => _discoveredBoardId = null),
                      child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
