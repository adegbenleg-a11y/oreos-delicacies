import { FeatureSteps } from "@/components/ui/feature-section"

const features = [
  { 
    step: 'Step 1', 
    title: 'Learn the Basics',
    content: 'Start your journey by exploring our handcrafted artisan recipes and selection.', 
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    step: 'Step 2',
    title: 'Custom Creations',
    content: 'Collaborate with our pastry artists for bespoke flavors, tiers, and personalized designs.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80'
  },
  { 
    step: 'Step 3',
    title: 'Doorstep Delivery',
    content: 'Freshly baked and safely delivered straight to your doorstep on your special day.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'
  },
]

export function FeatureStepsDemo() {
  return (
    <FeatureSteps 
      features={features}
      title="Your Journey Starts Here"
      autoPlayInterval={4000}
      imageHeight="h-[400px] md:h-[500px]"
    />
  )
}
