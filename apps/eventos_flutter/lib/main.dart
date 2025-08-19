import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';

/// Lê a URL da API do json-server. No Chrome use localhost; no Android emulador use 10.0.2.2.
const String kApiBase =
    String.fromEnvironment('API_BASE_URL', defaultValue: 'http://localhost:3005');

/// ===== Model =====
class Event {
  final String id;
  final String name;
  final String date;     // ISO yyyy-MM-dd
  final String? type;
  final String? location;

  Event({required this.id, required this.name, required this.date, this.type, this.location});

  factory Event.fromJson(Map<String, dynamic> json) => Event(
        id: json['id'].toString(),
        name: (json['name'] ?? '') as String,
        date: (json['date'] ?? '') as String,
        type: (json['type'] as String?),
        location: (json['location'] as String?),
      );
}

String prettyDate(String iso) {
  final d = DateTime.tryParse(iso);
  if (d == null) return iso;
  String two(int n) => n.toString().padLeft(2, '0');
  return '${two(d.day)}/${two(d.month)}/${d.year}';
}

/// ===== Dio (API) =====
final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(BaseOptions(baseUrl: kApiBase, headers: {'Accept': 'application/json'}));
  dio.interceptors.add(LogInterceptor(
    request: false,
    requestBody: false,
    responseBody: false,
    responseHeader: false,
  ));
  return dio;
});

/// ID selecionado (padrão 1)
final eventIdProvider = StateProvider<String>((ref) => '1');

/// Busca detalhes do evento
final eventProvider = FutureProvider.autoDispose<Event>((ref) async {
  final id = ref.watch(eventIdProvider);
  final dio = ref.watch(dioProvider);
  final resp = await dio.get('/events/$id');
  return Event.fromJson(Map<String, dynamic>.from(resp.data as Map));
});

/// ===== App =====
void main() => runApp(const ProviderScope(child: App()));

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = ColorScheme.fromSeed(seedColor: Colors.indigo, brightness: Brightness.dark);
    return MaterialApp(
      title: 'Detalhes do Evento (Flutter)',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorScheme: scheme),
      home: const EventDetailsPage(),
    );
  }
}

/// ===== UI =====
class EventDetailsPage extends ConsumerWidget {
  const EventDetailsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final async = ref.watch(eventProvider);
    final id = ref.watch(eventIdProvider);
    final idCtrl = TextEditingController(text: id);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalhes do Evento'),
        centerTitle: false,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // Trocar o ID e recarregar
          Row(children: [
            Expanded(
              child: TextFormField(
                controller: idCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'ID do evento',
                  helperText: 'Digite o ID e pressione Enter',
                ),
                onFieldSubmitted: (v) {
                  if (v.trim().isNotEmpty) {
                    ref.read(eventIdProvider.notifier).state = v.trim();
                  }
                },
              ),
            ),
            const SizedBox(width: 8),
            IconButton(
              tooltip: 'Recarregar',
              onPressed: () => ref.invalidate(eventProvider),
              icon: const Icon(Icons.refresh),
            ),
          ]),
          const SizedBox(height: 16),

          Expanded(
            child: async.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Center(
                child: Column(mainAxisSize: MainAxisSize.min, children: [
                  const Icon(Icons.error_outline, size: 40),
                  const SizedBox(height: 8),
                  Text('Erro ao carregar: $e', textAlign: TextAlign.center),
                  const SizedBox(height: 12),
                  FilledButton.tonal(
                    onPressed: () => ref.refresh(eventProvider),
                    child: const Text('Tentar novamente'),
                  ),
                ]),
              ),
              data: (ev) => ListView(
                children: [
                  Card(
                    elevation: 0,
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(ev.name,
                              style: Theme.of(context)
                                  .textTheme
                                  .titleLarge!
                                  .copyWith(fontWeight: FontWeight.bold)),
                          const SizedBox(height: 8),
                          Row(children: [
                            Text(prettyDate(ev.date)),
                            if (ev.type != null) ...[
                              const Text(' • '),
                              Text(ev.type!),
                            ],
                          ]),
                          if (ev.location != null) ...[
                            const SizedBox(height: 4),
                            Text(ev.location!),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Align(
                    alignment: Alignment.centerRight,
                    child: FilledButton.icon(
                      icon: const Icon(Icons.event_available),
                      label: const Text('Inscrever-se'),
                      onPressed: () async {
                        try {
                          final dio = ref.read(dioProvider);
                          await dio.post('/subscriptions', data: {
                            'eventId': ev.id,
                            'email': 'demo@user.com', // fictício para o teste
                            'createdAt': DateTime.now().toIso8601String(),
                          });
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Inscrição registrada!')),
                            );
                          }
                        } catch (e) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Falha ao inscrever: $e')),
                            );
                          }
                        }
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ]),
      ),
    );
  }
}
