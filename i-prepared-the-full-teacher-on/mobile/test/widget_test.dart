import 'package:flutter_test/flutter_test.dart';
import 'package:teacher_on_call_mobile/main.dart';

void main() {
  testWidgets('shows marketplace home screen', (tester) async {
    await tester.pumpWidget(const TeacherOnCallApp());

    expect(find.text('Teacher on Call'), findsOneWidget);
    expect(find.text('Find a tutor'), findsOneWidget);
    expect(find.text('Anita Sharma'), findsOneWidget);
    expect(find.text('Request booking'), findsOneWidget);
  });
}
