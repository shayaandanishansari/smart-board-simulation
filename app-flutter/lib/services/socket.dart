import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../models/pzem.dart';

class SocketService {
  final String nodeIp;
  final String boardId;
  final String pin;
  WebSocketChannel? _channel;

  SocketService({
    required this.nodeIp,
    required this.boardId,
    required this.pin,
  });

  Stream<Pzem> get pzemStream {
    final uri = Uri.parse('ws://$nodeIp:3000/pzem/$boardId?pin=$pin');
    _channel = WebSocketChannel.connect(uri);

    return _channel!.stream.map((data) {
      if (data == null || data.toString().isEmpty) {
        return Pzem.zero();
      }
      try {
        final json = jsonDecode(data.toString());
        return Pzem.fromJson(json);
      } catch (e) {
        debugPrint('WebSocket JSON parse error: $e. Data received: "$data"');
        return Pzem.zero();
      }
    });
  }

  void close() {
    _channel?.sink.close();
  }
}
