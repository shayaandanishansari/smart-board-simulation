import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String nodeIp;
  final String boardId;
  final String pin;

  ApiService({
    required this.nodeIp,
    required this.boardId,
    required this.pin,
  });

  String get baseUrl => 'http://$nodeIp:3000';

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'x-board-id': boardId,
        'x-pin': pin,
      };

  Future<bool> getRelayState() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/relay/$boardId'),
        headers: _headers,
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['relay_state'] == true;
      }
    } catch (e) {
      debugPrint('Error getting relay state: $e');
    }
    return false;
  }

  Future<bool> toggleRelay(bool state) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/relay/$boardId'),
        headers: _headers,
        body: jsonEncode({'relay_state': state}),
      );
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('Error toggling relay: $e');
    }
    return false;
  }
}
