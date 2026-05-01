class Board {
  final String boardId;
  final String? pin;
  final String? name;

  Board({required this.boardId, this.pin, this.name});

  factory Board.fromJson(Map<String, dynamic> json) {
    return Board(
      boardId: json['board_id'],
      pin: json['pin'],
      name: json['name'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'board_id': boardId,
      'pin': pin,
      'name': name,
    };
  }

  Board copyWith({String? boardId, String? pin, String? name}) {
    return Board(
      boardId: boardId ?? this.boardId,
      pin: pin ?? this.pin,
      name: name ?? this.name,
    );
  }
}
