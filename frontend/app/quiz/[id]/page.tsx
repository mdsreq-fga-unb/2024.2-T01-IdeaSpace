import QuizClient from './quiz-client';
import { fetchQuestionnaires } from '@/services/questionnaire';

// This is a server component that handles static params
export async function generateStaticParams() {
  try {
    // Since we can't know all possible IDs at build time,
    // we'll generate a reasonable range of IDs
    return Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString()
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function QuizPage({ params }: { params: { id: string } }) {
  return <QuizClient params={params} />;
}