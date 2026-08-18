import React, { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HeroSection = lazy(() => import('../components/home/HeroSection'));
const WhyChooseSection = lazy(() => import('../components/home/WhyChooseSection'));
const StatsSection = lazy(() => import('../components/home/StatsSection'));
const FeaturesSection = lazy(() => import('../components/home/FeaturesSection'));
const HowItWorksSection = lazy(() => import('../components/home/HowItWorksSection'));
const AmenitiesSection = lazy(() => import('../components/home/AmenitiesSection'));
const TestimonialsSection = lazy(() => import('../components/home/TestimonialsSection'));
const PartnersSection = lazy(() => import('../components/home/PartnersSection'));
const CTASection = lazy(() => import('../components/home/CTASection'));

const Home = () => {
  return (
    <div className="min-h-screen bg-primary overflow-x-hidden">
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
        <WhyChooseSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AmenitiesSection />
        <TestimonialsSection />
        <PartnersSection />
        <CTASection />
      </Suspense>
    </div>
  );
};

export default Home;