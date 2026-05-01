class Pzem {
  final double voltage;
  final double current;
  final double power;
  final double energy;

  Pzem({
    required this.voltage,
    required this.current,
    required this.power,
    required this.energy,
  });

  factory Pzem.fromJson(Map<String, dynamic> json) {
    return Pzem(
      voltage: (json['voltage'] as num).toDouble(),
      current: (json['current'] as num).toDouble(),
      power: (json['power'] as num).toDouble(),
      energy: (json['energy'] as num).toDouble(),
    );
  }

  factory Pzem.zero() {
    return Pzem(voltage: 0, current: 0, power: 0, energy: 0);
  }

  Map<String, dynamic> toJson() {
    return {
      'voltage': voltage,
      'current': current,
      'power': power,
      'energy': energy,
    };
  }
}
