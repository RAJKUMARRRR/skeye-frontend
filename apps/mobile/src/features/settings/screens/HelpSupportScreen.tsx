import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ContactOption {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  action: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'How do I start tracking a trip?',
    answer: 'Navigate to the Trips tab, select your assigned trip, and tap the "Start Trip" button. Make sure location permissions are enabled.',
  },
  {
    id: '2',
    question: 'What should I do if I encounter an issue during a trip?',
    answer: 'Use the Alerts tab to report any issues immediately. You can also contact dispatch through the app or call the emergency support number.',
  },
  {
    id: '3',
    question: 'How do I complete a trip?',
    answer: 'Once you arrive at your destination, tap "Complete Trip" in the trip details screen. You may need to capture a signature or complete a checklist.',
  },
  {
    id: '4',
    question: 'Why is my location not being tracked?',
    answer: 'Check that you have granted both foreground and background location permissions in your device settings. Also ensure that GPS is enabled.',
  },
  {
    id: '5',
    question: 'How do I update my profile information?',
    answer: 'Go to the Profile tab and tap "Edit Profile" to update your personal information, contact details, and preferences.',
  },
];

export default function HelpSupportScreen() {
  const [expandedFAQ, setExpandedFAQ] = React.useState<string | null>(null);

  const contactOptions: ContactOption[] = [
    {
      id: 'phone',
      icon: 'call-outline',
      title: 'Call Support',
      description: '24/7 Emergency Support',
      action: () => Linking.openURL('tel:+18005551234'),
    },
    {
      id: 'email',
      icon: 'mail-outline',
      title: 'Email Support',
      description: 'support@fleetmanagement.com',
      action: () => Linking.openURL('mailto:support@fleetmanagement.com'),
    },
    {
      id: 'chat',
      icon: 'chatbubble-outline',
      title: 'Live Chat',
      description: 'Chat with our team',
      action: () => Alert.alert('Live Chat', 'Live chat feature coming soon'),
    },
    {
      id: 'website',
      icon: 'globe-outline',
      title: 'Help Center',
      description: 'Visit our online help center',
      action: () => Linking.openURL('https://help.fleetmanagement.com'),
    },
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <View style={styles.contactGrid}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactCard}
                onPress={option.action}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon} size={28} color="#3b82f6" />
                </View>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {FAQ_ITEMS.map((item) => (
              <View key={item.id} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(item.id)}
                >
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Ionicons
                    name={expandedFAQ === item.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
                {expandedFAQ === item.id && (
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build Number</Text>
              <Text style={styles.infoValue}>100</Text>
            </View>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => Linking.openURL('https://fleetmanagement.com/terms')}
            >
              <Text style={styles.infoLabel}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.infoRow}
              onPress={() => Linking.openURL('https://fleetmanagement.com/privacy')}
            >
              <Text style={styles.infoLabel}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.feedbackButton}
            onPress={() => Linking.openURL('mailto:feedback@fleetmanagement.com?subject=App Feedback')}
          >
            <Ionicons name="create-outline" size={20} color="#3b82f6" />
            <Text style={styles.feedbackButtonText}>Send Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  contactDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  faqList: {
    gap: 8,
  },
  faqCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: '#1f2937',
  },
  infoValue: {
    fontSize: 15,
    color: '#6b7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  feedbackButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3b82f6',
  },
});
