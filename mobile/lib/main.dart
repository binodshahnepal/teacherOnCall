import 'package:flutter/material.dart';

void main() {
  runApp(const TeacherOnCallApp());
}

class TeacherOnCallApp extends StatelessWidget {
  const TeacherOnCallApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Teacher on Call',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF17785D),
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF0F4F1),
        useMaterial3: true,
      ),
      home: const MarketplaceHome(),
    );
  }
}

class MarketplaceHome extends StatefulWidget {
  const MarketplaceHome({super.key});

  @override
  State<MarketplaceHome> createState() => _MarketplaceHomeState();
}

class _MarketplaceHomeState extends State<MarketplaceHome> {
  final List<Tutor> tutors = const [
    Tutor(
      name: 'Anita Sharma',
      city: 'Kathmandu',
      subjects: ['Mathematics', 'Physics'],
      modes: ['Online', 'Home tuition'],
      rate: 1400,
      rating: 4.8,
      verified: true,
    ),
    Tutor(
      name: 'Rahul Adhikari',
      city: 'Lalitpur',
      subjects: ['English', 'IELTS'],
      modes: ['Online'],
      rate: 1200,
      rating: 4.7,
      verified: true,
    ),
    Tutor(
      name: 'Mina Karki',
      city: 'Bhaktapur',
      subjects: ['Chemistry', 'Biology'],
      modes: ['Online', 'Home tuition'],
      rate: 1300,
      rating: 0,
      verified: false,
    ),
  ];

  int selectedIndex = 0;
  int selectedDashboard = 0;
  bool requestSent = false;

  @override
  Widget build(BuildContext context) {
    final selectedTutor = tutors[selectedIndex];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Teacher on Call'),
        actions: [
          IconButton(
            tooltip: 'Messages',
            onPressed: () {},
            icon: const Icon(Icons.chat_bubble_outline),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const _SectionTitle(
              title: 'Find a tutor',
              subtitle: 'Marketplace-first MVP for discovery and booking',
            ),
            const SizedBox(height: 12),
            TextField(
              decoration: InputDecoration(
                hintText: 'Search subject or city',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 220,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: tutors.length,
                separatorBuilder: (_, _) => const SizedBox(width: 12),
                itemBuilder: (context, index) {
                  final tutor = tutors[index];
                  return _TutorCard(
                    tutor: tutor,
                    selected: selectedIndex == index,
                    onTap: () {
                      setState(() {
                        selectedIndex = index;
                        requestSent = false;
                      });
                    },
                  );
                },
              ),
            ),
            const SizedBox(height: 18),
            _BookingPanel(
              tutor: selectedTutor,
              requestSent: requestSent,
              onRequest: () => setState(() => requestSent = true),
            ),
            const SizedBox(height: 18),
            _RoleDashboard(
              selectedIndex: selectedDashboard,
              onChanged: (index) => setState(() => selectedDashboard = index),
            ),
            const SizedBox(height: 18),
            const _PaymentStatusPanel(),
          ],
        ),
      ),
    );
  }
}

class _RoleDashboard extends StatelessWidget {
  const _RoleDashboard({required this.selectedIndex, required this.onChanged});

  final int selectedIndex;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    final dashboards = const [
      _DashboardData(
        title: 'Student dashboard',
        items: [
          _DashboardItem(Icons.calendar_month, 'Bookings', '1 accepted, 1 requested'),
          _DashboardItem(Icons.chat_bubble_outline, 'Messages', 'Latest reply from Anita'),
          _DashboardItem(Icons.receipt_long, 'Payments', 'NPR 1,400 recorded'),
        ],
      ),
      _DashboardData(
        title: 'Tutor dashboard',
        items: [
          _DashboardItem(Icons.verified, 'Verification', 'Profile visible'),
          _DashboardItem(Icons.pending_actions, 'Requests', '1 needs action'),
          _DashboardItem(Icons.account_balance_wallet, 'Earnings', 'NPR 1,190 net'),
        ],
      ),
      _DashboardData(
        title: 'Admin dashboard',
        items: [
          _DashboardItem(Icons.fact_check, 'Tutor queue', '1 pending review'),
          _DashboardItem(Icons.payments, 'Revenue', 'NPR 1,400 recorded'),
          _DashboardItem(Icons.video_call, 'Sessions', '1 scheduled'),
        ],
      ),
    ];
    final selected = dashboards[selectedIndex];

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Role dashboards', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900)),
            const SizedBox(height: 12),
            SegmentedButton<int>(
              segments: const [
                ButtonSegment(value: 0, icon: Icon(Icons.school), label: Text('Student')),
                ButtonSegment(value: 1, icon: Icon(Icons.person_search), label: Text('Tutor')),
                ButtonSegment(value: 2, icon: Icon(Icons.admin_panel_settings), label: Text('Admin')),
              ],
              selected: {selectedIndex},
              onSelectionChanged: (selection) => onChanged(selection.first),
              showSelectedIcon: false,
            ),
            const SizedBox(height: 16),
            Text(selected.title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
            const SizedBox(height: 12),
            ...selected.items.map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: _InfoTile(icon: item.icon, label: item.label, value: item.value),
                )),
          ],
        ),
      ),
    );
  }
}

class _DashboardData {
  const _DashboardData({required this.title, required this.items});

  final String title;
  final List<_DashboardItem> items;
}

class _DashboardItem {
  const _DashboardItem(this.icon, this.label, this.value);

  final IconData icon;
  final String label;
  final String value;
}

class Tutor {
  const Tutor({
    required this.name,
    required this.city,
    required this.subjects,
    required this.modes,
    required this.rate,
    required this.rating,
    required this.verified,
  });

  final String name;
  final String city;
  final List<String> subjects;
  final List<String> modes;
  final int rate;
  final double rating;
  final bool verified;
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
        const SizedBox(height: 4),
        Text(subtitle, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.black54)),
      ],
    );
  }
}

class _TutorCard extends StatelessWidget {
  const _TutorCard({required this.tutor, required this.selected, required this.onTap});

  final Tutor tutor;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 250,
      child: Card(
        elevation: selected ? 2 : 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: BorderSide(color: selected ? const Color(0xFF17785D) : const Color(0xFFD3DED8), width: 1.5),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(8),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(child: Text(tutor.name, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800))),
                    Icon(tutor.verified ? Icons.verified : Icons.pending_actions, size: 20, color: const Color(0xFF17785D)),
                  ],
                ),
                const SizedBox(height: 8),
                Text('${tutor.city} · ${tutor.modes.join(', ')}'),
                const SizedBox(height: 8),
                Text(tutor.subjects.join(', '), style: const TextStyle(fontWeight: FontWeight.w700)),
                const Spacer(),
                Text('NPR ${tutor.rate}/hr', style: const TextStyle(color: Color(0xFF126448), fontWeight: FontWeight.w900)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _BookingPanel extends StatelessWidget {
  const _BookingPanel({required this.tutor, required this.requestSent, required this.onRequest});

  final Tutor tutor;
  final bool requestSent;
  final VoidCallback onRequest;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Book ${tutor.name}', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
            const SizedBox(height: 12),
            const TextField(
              maxLines: 3,
              decoration: InputDecoration(
                labelText: 'Session goal',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            Row(
              children: const [
                Expanded(child: _InfoTile(icon: Icons.event, label: 'Next slot', value: 'Fri, May 8')),
                SizedBox(width: 10),
                Expanded(child: _InfoTile(icon: Icons.video_call, label: 'Meeting', value: 'External link')),
              ],
            ),
            const SizedBox(height: 14),
            FilledButton.icon(
              onPressed: onRequest,
              icon: const Icon(Icons.calendar_month),
              label: const Text('Request booking'),
            ),
            if (requestSent)
              const Padding(
                padding: EdgeInsets.only(top: 10),
                child: Text('Request sent for tutor acceptance.', style: TextStyle(color: Color(0xFF126448), fontWeight: FontWeight.w700)),
              ),
          ],
        ),
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  const _InfoTile({required this.icon, required this.label, required this.value});

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF2F7F4),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: const Color(0xFF17785D)),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(color: Colors.black54, fontWeight: FontWeight.w700)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }
}

class _PaymentStatusPanel extends StatelessWidget {
  const _PaymentStatusPanel();

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Payment and booking status', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
            SizedBox(height: 12),
            _InfoTile(icon: Icons.check_circle_outline, label: 'Accepted session', value: 'Math trial class'),
            SizedBox(height: 10),
            _InfoTile(icon: Icons.payments, label: 'Manual payment', value: 'Recorded'),
            SizedBox(height: 10),
            _InfoTile(icon: Icons.account_balance_wallet, label: 'Tutor payout', value: 'NPR 1,190 net'),
          ],
        ),
      ),
    );
  }
}
