import 'dart:convert';
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
      final json = jsonDecode(data);
      return Pzem.fromJson(json);
    });
  }

  void close() {
    _channel?.sink.close();
  }
}
