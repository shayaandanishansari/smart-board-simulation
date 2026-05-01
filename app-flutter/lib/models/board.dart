class Board {
  final String boardId;
  final String? pin;

  Board({required this.boardId, this.pin});

  factory Board.fromJson(Map<String, dynamic> json) {
    return Board(
      boardId: json['board_id'],
      pin: json['pin'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'board_id': boardId,
      'pin': pin,
    };
  }

  Board copyWith({String? boardId, String? pin}) {
    return Board(
      boardId: boardId ?? this.boardId,
      pin: pin ?? this.pin,
    );
  }
}
