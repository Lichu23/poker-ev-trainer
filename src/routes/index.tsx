import { createFileRoute } from '@tanstack/react-router'
import { OnboardingScreen } from '@/components/OnboardingScreen'

export const Route = createFileRoute('/')({
  component: OnboardingScreen,
})