import React, { useState } from 'react';
import { LogoIcon, ShieldCheckIcon, DocumentCheckIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon, CheckCircleIcon, ShopifyLogoIcon, ShiprocketLogoIcon } from '../components/icons/Icons';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

interface OnboardingProps {
    onComplete: () => void;
}

const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="flex w-full max-w-sm mx-auto space-x-2 my-8">
        {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${currentStep >= s ? 'bg-primary' : 'bg-gray-200'}`} />
        ))}
    </div>
);

const OnboardingKpiCard: React.FC<{ title: string; value: string; change?: string; changeType?: 'good' | 'bad' }> = ({ title, value, change, changeType }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex-1">
        <h3 className="text-sm font-medium text-light-grey">{title}</h3>
        <p className="text-3xl font-bold text-charcoal mt-1">{value}</p>
        {change && (
            <div className={`mt-1 flex items-center text-sm font-semibold ${changeType === 'good' ? 'text-success' : 'text-danger'}`}>
                {changeType === 'good' ? <ArrowTrendingUpIcon className="w-4 h-4 mr-1" /> : <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />}
                {change} vs. last month
            </div>
        )}
    </div>
);

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [showRtoResult, setShowRtoResult] = useState(false);
    const [showGstResult, setShowGstResult] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const [connections, setConnections] = useState({ shopify: false, shiprocket: false });
    const [connecting, setConnecting] = useState<string | null>(null);

    const handleActivateRtoShield = () => {
        setIsActivating(true);
        setTimeout(() => {
            setShowRtoResult(true);
            setIsActivating(false);
        }, 1500);
    };
    
    const handleGenerateGstReport = () => {
        setIsActivating(true);
        setTimeout(() => {
            setShowGstResult(true);
            setIsActivating(false);
        }, 1500);
    };

    const handleConnect = (platform: 'shopify' | 'shiprocket') => {
        setConnecting(platform);
        setTimeout(() => {
            setConnections(prev => ({ ...prev, [platform]: true }));
            setConnecting(null);
            toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`);
        }, 1500);
    };

    const nextStep = () => {
        if (step < 5) {
            setStep(s => s + 1);
        }
    };
    
    const renderContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="text-center">
                        <LogoIcon className="w-12 h-12 text-primary mx-auto" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mt-4">Welcome to D2C-Sync</h1>
                        <p className="mt-4 max-w-xl mx-auto text-lg text-light-grey">
                            Ready to see how you can stop leaking profit on returns and GST headaches?
                        </p>
                        <Button onClick={nextStep} size="md" className="mt-8 py-3 px-8 text-lg">
                            Let's see how
                        </Button>
                    </div>
                );
            case 2:
                return (
                    <div className="w-full max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-charcoal">Step 1: Slash Your RTO Rate</h2>
                        <p className="mt-2 text-light-grey">High RTO rates silently drain your profits. Let's fix that.</p>
                        <div className={`mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 transition-opacity duration-500 ${isActivating ? 'opacity-50' : 'opacity-100'}`} aria-live="polite">
                            {!showRtoResult ? (
                                <>
                                    <OnboardingKpiCard title="RTO Rate" value="18.5%" change="+2.1%" changeType="bad" />
                                    <OnboardingKpiCard title="Monthly RTO Loss" value="₹89,200" />
                                    <OnboardingKpiCard title="Net Profit Margin" value="8.2%" />
                                </>
                            ) : (
                                <>
                                    <OnboardingKpiCard title="RTO Rate" value="11.2%" change="-7.3%" changeType="good" />
                                    <OnboardingKpiCard title="Monthly Savings" value="₹35,400" />
                                    <OnboardingKpiCard title="Net Profit Margin" value="11.5%" change="+3.3%" changeType="good" />
                                </>
                            )}
                        </div>
                         <div className="mt-8 h-16 flex items-center justify-center">
                            {!showRtoResult ? (
                                <Button onClick={handleActivateRtoShield} isLoading={isActivating} size="md" className="py-3 px-6 text-lg">
                                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                    Activate RTO Shield
                                </Button>
                            ) : (
                                <div className="text-center">
                                    <p className="text-success font-semibold text-lg">You just saved ₹35,400 this month by preventing high-risk orders!</p>
                                    <Button onClick={nextStep} variant="secondary" className="mt-2" aria-label="Continue to integrations setup">Continue</Button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="w-full max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-charcoal">Step 2: Connect Your Tools</h2>
                        <p className="mt-2 text-light-grey">Sync your sales and logistics data in seconds.</p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                                <ShopifyLogoIcon className="h-12 mx-auto text-charcoal" />
                                <h3 className="mt-4 font-bold text-lg text-charcoal">Shopify</h3>
                                <p className="text-sm text-light-grey">E-commerce Platform</p>
                                <div className="mt-6 h-10">
                                    {connections.shopify ? (
                                        <div className="inline-flex items-center justify-center font-semibold rounded-md text-success bg-green-50 py-2 px-4">
                                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                                            Connected
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={() => handleConnect('shopify')} 
                                            isLoading={connecting === 'shopify'}
                                        >
                                            Connect
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                                <ShiprocketLogoIcon className="h-12 mx-auto text-charcoal" />
                                <h3 className="mt-4 font-bold text-lg text-charcoal">Shiprocket</h3>
                                <p className="text-sm text-light-grey">Logistics Provider</p>
                                <div className="mt-6 h-10">
                                     {connections.shiprocket ? (
                                        <div className="inline-flex items-center justify-center font-semibold rounded-md text-success bg-green-50 py-2 px-4">
                                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                                            Connected
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={() => handleConnect('shiprocket')} 
                                            isLoading={connecting === 'shiprocket'}
                                        >
                                            Connect
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                         <div className="mt-8 h-16 flex items-center justify-center">
                            {connections.shopify && connections.shiprocket && (
                                <div className="text-center animate-fade-in">
                                     <p className="text-success font-semibold text-lg">Your tools are connected!</p>
                                     <Button onClick={nextStep} variant="secondary" className="mt-2" aria-label="Continue to GST compliance simulation">Continue</Button>
                                </div>
                            )}
                        </div>
                    </div>
                );
             case 4:
                return (
                     <div className="w-full max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-charcoal">Step 3: Simplify GST Compliance</h2>
                        <p className="mt-2 text-light-grey">Stop wasting hours on manual RTO-related GST adjustments.</p>
                        <div className="mt-6 min-h-[16rem] bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                            {!showGstResult ? (
                                <div className="w-full max-w-full text-center">
                                    <div className="w-full overflow-x-auto border border-gray-300 rounded-md bg-gray-50 p-1 shadow-inner">
                                        <table className="w-full text-xs text-left text-charcoal">
                                            <thead className="bg-gray-200">
                                                <tr>
                                                    <th className="p-2 font-semibold whitespace-nowrap">Order ID</th>
                                                    <th className="p-2 font-semibold whitespace-nowrap">Customer Name (from Shopify)</th>
                                                    <th className="p-2 font-semibold whitespace-nowrap">RTO Date</th>
                                                    <th className="p-2 font-semibold whitespace-nowrap">Value</th>
                                                    <th className="p-2 font-semibold text-center whitespace-nowrap">GST Adjustment Needed?</th>
                                                    <th className="p-2 font-semibold whitespace-nowrap">Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-gray-200">
                                                    <td className="p-2 font-mono">#DS-1048</td>
                                                    <td className="p-2">Rohan Sharma</td>
                                                    <td className="p-2">02/05/2024</td>
                                                    <td className="p-2 text-right">1299.00</td>
                                                    <td className="p-2 text-center font-bold text-warning">YES</td>
                                                    <td className="p-2 text-danger">Crossed tax period. manual credit note required!!</td>
                                                </tr>
                                                <tr className="border-b border-gray-200 bg-yellow-100">
                                                    <td className="p-2 font-mono">#DS-1051</td>
                                                    <td className="p-2">P. Gupta</td>
                                                    <td className="p-2">05/05/2024</td>
                                                    <td className="p-2 text-right">1999</td>
                                                    <td className="p-2 text-center font-bold text-warning">pending</td>
                                                    <td className="p-2">Check with Ankur</td>
                                                </tr>
                                                <tr className="border-b border-gray-200">
                                                    <td className="p-2 font-mono">DS-1052</td>
                                                    <td className="p-2">Amit P.</td>
                                                    <td className="p-2">May 6</td>
                                                    <td className="p-2 text-right">₹2,499.00</td>
                                                    <td className="p-2 text-center text-success">DONE</td>
                                                    <td className="p-2"></td>
                                                </tr>
                                                 <tr className="border-b-0">
                                                    <td className="p-2 font-mono">#DS-1055</td>
                                                    <td className="p-2">Sneha Singh</td>
                                                    <td className="p-2">N/A</td>
                                                    <td className="p-2 text-right">2199.00</td>
                                                    <td className="p-2 text-center">NO</td>
                                                    <td className="p-2 text-light-grey">Delivered successfully.</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-sm text-light-grey mt-2">Your current manual process...</p>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <h3 className="font-semibold text-charcoal mb-2 text-center">May 2024 - GSTR-1 Credit Note Report</h3>
                                    <table className="w-full max-w-lg mx-auto text-sm text-charcoal">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-2 px-4 text-left font-medium text-charcoal">Customer</th>
                                                <th className="py-2 px-4 text-left font-medium text-charcoal">Order Value</th>
                                                <th className="py-2 px-4 text-left font-medium text-charcoal">GST Reclaim</th>
                                                <th className="py-2 px-4 text-left font-medium text-charcoal">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="py-2 px-4">Rohan Sharma</td>
                                                <td className="py-2 px-4">₹1,299</td>
                                                <td className="py-2 px-4">₹233.82</td>
                                                <td className="py-2 px-4"><span className="text-success font-semibold">Generated</span></td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-2 px-4">Priya Gupta</td>
                                                <td className="py-2 px-4">₹1,999</td>
                                                <td className="py-2 px-4">₹359.82</td>
                                                <td className="py-2 px-4"><span className="text-success font-semibold">Generated</span></td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-4">Amit Patel</td>
                                                <td className="py-2 px-4">₹2,499</td>
                                                <td className="py-2 px-4">₹449.82</td>
                                                <td className="py-2 px-4"><span className="text-success font-semibold">Generated</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                         <div className="mt-8 h-16 flex items-center justify-center">
                            {!showGstResult ? (
                                <Button onClick={handleGenerateGstReport} isLoading={isActivating} size="md" className="py-3 px-6 text-lg">
                                    <DocumentCheckIcon className="w-5 h-5 mr-2" />
                                    Generate GST Report
                                </Button>
                            ) : (
                                <div className="text-center">
                                    <p className="text-success font-semibold text-lg">Your GST credit notes are ready in one click!</p>
                                    <Button onClick={nextStep} variant="secondary" className="mt-2" aria-label="Finish onboarding and proceed to summary">Finish</Button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="text-center max-w-2xl mx-auto">
                        <CheckCircleIcon className="w-16 h-16 text-success mx-auto" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mt-4">The 'Aha!' Moment</h1>
                        <p className="mt-4 text-lg text-light-grey">
                           You've seen how D2C-Sync automates your two biggest post-purchase headaches, turning losses into profit and saving you hours of manual work.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                             <Button onClick={() => toast.success('Your demo has been booked!')} size="md" className="py-3 px-8 text-lg w-full sm:w-auto">
                                Book a Live Demo
                            </Button>
                             <Button onClick={onComplete} variant="secondary" size="md" className="py-3 px-8 text-lg w-full sm:w-auto">
                                Enter App Simulation
                            </Button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
            <Button
                variant="secondary"
                size="sm"
                className="absolute top-6 right-6 z-10"
                onClick={onComplete}
            >
                Skip Onboarding
            </Button>
             <div className="w-full max-w-4xl">
                <ProgressBar currentStep={step} />
                <div className="mt-8 p-8 min-h-[500px] flex items-center justify-center">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;