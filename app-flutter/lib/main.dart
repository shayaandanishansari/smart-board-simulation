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
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF12121A),
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.green,
          brightness: Brightness.dark,
          primary: Colors.greenAccent,
          secondary: Colors.green,
          surface: const Color(0xFF1E1E26),
        ),
        useMaterial3: true,
        cardTheme: CardThemeData(
          color: const Color(0xFF1E1E26),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          elevation: 0,
        ),
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
