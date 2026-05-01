import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'storage/app_storage.dart';
import 'state/board_provider.dart';
import 'screens/dashboard_screen.dart';
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
    // Discovery runs in background
    _initialDiscovery(ref);

    return MaterialApp(
      title: 'SmartBoard Control',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const DashboardScreen(),
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
