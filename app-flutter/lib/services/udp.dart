import 'dart:convert';
import 'package:udp/udp.dart';

class UdpService {
  static const int port = 4210;

  static Future<String?> discoverNode() async {
    final sender = await UDP.bind(Endpoint.any(port: Port(0)));
    final broadcastEndpoint = Endpoint.broadcast(port: Port(port));
    
    await sender.send(
      utf8.encode('DISCOVER_SMARTBOARD_NODE'),
      broadcastEndpoint,
    );

    // Listen for response
    String? nodeIp;
    await sender.asStream(timeout: const Duration(seconds: 3)).firstWhere((datagram) {
      if (datagram != null) {
        final message = utf8.decode(datagram.data);
        if (message.startsWith('SMARTBOARD_NODE_IP:')) {
          nodeIp = message.split(':')[1];
          return true;
        }
      }
      return false;
    }).timeout(const Duration(seconds: 3), onTimeout: () => null);

    sender.close();
    return nodeIp;
  }

  static Stream<String> listenForPairing() async* {
    final receiver = await UDP.bind(Endpoint.any(port: Port(port)));
    
    await for (final datagram in receiver.asStream()) {
      if (datagram != null) {
        final message = utf8.decode(datagram.data);
        if (message.startsWith('PAIR_REQUEST:')) {
          yield message.split(':')[1]; // Returns board_id
        }
      }
    }
    receiver.close();
  }
}
