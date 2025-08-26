import React from 'react';
import { LogoIcon, ScaleIcon, TruckIcon, SparklesIcon, CpuChipIcon, PuzzlePieceIcon, ArrowPathRoundedSquareIcon } from '../components/icons/Icons';
import Button from '../components/ui/Button';

interface LandingPageProps {
  onEnter: () => void;
  onSkip: () => void;
}

const FeatureHighlight: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-white p-8 rounded-lg border border-gray-200 text-left transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <div className="flex items-center">
            <div className="bg-primary/10 p-3 rounded-full mr-4">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-charcoal">{title}</h3>
        </div>
        <div className="mt-4 text-light-grey space-y-4">
            {children}
        </div>
    </div>
);

const HowItWorksStep: React.FC<{ icon: React.ReactNode; title: string; description: string; step: number; }> = ({ icon, title, description, step }) => (
    <div className="flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-primary/10 rounded-full"></div>
             <div className="relative text-primary">
                 {icon}
            </div>
             <span className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 font-bold text-white bg-primary rounded-full border-4 border-white">{step}</span>
        </div>
        <h3 className="mt-4 text-xl font-bold text-charcoal">{title}</h3>
        <p className="mt-1 text-light-grey max-w-xs">{description}</p>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onSkip }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div className="text-center py-20 px-4 border-b border-gray-100">
        <div className="flex items-center justify-center mb-6">
          <LogoIcon className="w-12 h-12 text-primary" />
          <span className="ml-4 text-4xl font-bold text-charcoal font-display">d2c-sync</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-charcoal tracking-tight leading-tight max-w-4xl mx-auto">
          Stop Leaking Profit. <br/> <span className="text-primary">Start Automating.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-light-grey">
          D2C-Sync is the all-in-one platform that turns your biggest operational headaches—RTOs and GST compliance—into sources of growth.
        </p>
        <div className="mt-10">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={onEnter} size="md" className="py-3 px-8 text-lg w-full sm:w-auto transform transition-transform duration-300 hover:scale-105">
                Enter App Simulation
            </Button>
            <Button onClick={onSkip} variant="secondary" size="md" className="py-3 px-8 text-lg w-full sm:w-auto">
                Skip to Dashboard
            </Button>
          </div>
          <p className="mt-3 text-sm text-light-grey">
            This is a fully interactive demo. No real data is processed or stored.
          </p>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">Turn Operational Chaos into Automated Efficiency</h2>
          <p className="mt-4 text-lg text-light-grey">Your D2C brand has two silent profit killers. We solve them both.</p>
        </div>
        <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureHighlight icon={<ScaleIcon className="w-8 h-8 text-primary" />} title="Tame GST Complexity">
                 <div>
                    <strong className="font-bold text-charcoal">The Pain:</strong>
                    <p>Manually tracking RTOs across tax periods for GST credit notes is a nightmare of spreadsheets and lost revenue.</p>
                </div>
                 <div>
                    <strong className="font-bold text-charcoal flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-primary" /> The Solution:</strong>
                    <p>D2C-Sync automatically identifies RTOs needing GST adjustments and generates the required credit notes, saving you hours and reclaiming every last rupee.</p>
                </div>
            </FeatureHighlight>
            <FeatureHighlight icon={<TruckIcon className="w-8 h-8 text-primary" />} title="Eliminate RTO Guesswork">
                 <div>
                    <strong className="font-bold text-charcoal">The Pain:</strong>
                    <p>Shipping every Cash-on-Delivery order is a gamble. High-risk orders eat into your profits with wasted shipping and return fees.</p>
                </div>
                 <div>
                    <strong className="font-bold text-charcoal flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-primary" /> The Solution:</strong>
                    <p>Our predictive AI analyzes every order, flagging high-risk shipments *before* they leave your warehouse. Intervene, confirm, and slash your RTO rate.</p>
                </div>
            </FeatureHighlight>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">How It Works in 3 Simple Steps</h2>
        </div>
        <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            <HowItWorksStep
                step={1}
                icon={<PuzzlePieceIcon className="w-10 h-10" />}
                title="Connect"
                description="Integrate your Shopify/WooCommerce store and logistics partners like Shiprocket in just a few clicks."
            />
            <HowItWorksStep
                step={2}
                icon={<CpuChipIcon className="w-10 h-10" />}
                title="Analyze"
                description="D2C-Sync instantly analyzes sales, shipment, and returns data to identify profit leaks and compliance gaps."
            />
             <HowItWorksStep
                step={3}
                icon={<ArrowPathRoundedSquareIcon className="w-10 h-10" />}
                title="Automate"
                description="From generating GST credit notes to flagging high-risk orders, we handle the tedious work so you can focus on growth."
            />
        </div>
      </div>

       {/* Final CTA */}
        <div className="bg-gray-50 py-20 px-4 text-center">
             <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">Ready to see it in action?</h2>
             <p className="mt-4 max-w-2xl mx-auto text-lg text-light-grey">
               Take the next step and explore the dashboard. No commitment, just clarity.
            </p>
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button onClick={onEnter} size="md" className="py-3 px-8 text-lg w-full sm:w-auto transform transition-transform duration-300 hover:scale-105">
                    Enter App Simulation
                </Button>
                <Button onClick={onSkip} variant="secondary" size="md" className="py-3 px-8 text-lg w-full sm:w-auto">
                    Skip to Dashboard
                </Button>
              </div>
            </div>
        </div>
    </div>
  );
};

export default LandingPage;