import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'storage/app_storage.dart';
import 'state/board_provider.dart';
import 'screens/board_screen.dart';
import 'screens/pairing_screen.dart';
import 'services/udp.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppStorage.init();
  runApp(const ProviderScope(child: SmartBoardApp()));
}

class SmartBoardApp extends ConsumerWidget {
  const SmartBoardApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final board = ref.watch(boardProvider);

    // Initial discovery if not already done
    _initialDiscovery(ref);

    return MaterialApp(
      title: 'SmartBoard Control',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: board == null ? const PairingScreen() : const BoardScreen(),
    );
  }

  void _initialDiscovery(WidgetRef ref) async {
    if (ref.read(nodeIpProvider) == null) {
      final ip = await UdpService.discoverNode();
      if (ip != null) {
        ref.read(nodeIpProvider.notifier).setIp(ip);
      }
    }
  }
}
