import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Integration } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { CheckCircleIcon, ExclamationCircleIcon, LinkIcon } from '../components/icons/Icons';

const IntegrationCard: React.FC<{ integration: Integration, onAction: (id: string, currentStatus: Integration['status']) => void, processing: boolean }> = ({ integration, onAction, processing }) => {
    const StatusIndicator = () => {
        switch(integration.status) {
            case 'Connected': return <div className="flex items-center text-sm text-success"><CheckCircleIcon className="w-4 h-4 mr-1" /> Connected</div>;
            case 'Needs Re-authentication': return <div className="flex items-center text-sm text-warning"><ExclamationCircleIcon className="w-4 h-4 mr-1" /> Needs Re-authentication</div>;
            case 'Not Connected': return <div className="flex items-center text-sm text-light-grey"><LinkIcon className="w-4 h-4 mr-1" /> Not Connected</div>;
        }
    }
    
    const ActionButton = () => {
        switch(integration.status) {
            case 'Connected': 
                return <Button variant="secondary" size="sm" className="w-full sm:w-auto" onClick={() => onAction(integration.id, 'Connected')}>Disconnect</Button>;
            case 'Needs Re-authentication': 
                return <Button size="sm" className="w-full sm:w-auto" onClick={() => onAction(integration.id, 'Needs Re-authentication')} isLoading={processing}>Re-authenticate</Button>;
            case 'Not Connected': 
                return <Button size="sm" className="w-full sm:w-auto" onClick={() => onAction(integration.id, 'Not Connected')} isLoading={processing}>Connect</Button>;
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 border-b border-gray-200 last:border-b-0 gap-4 sm:gap-2">
            <div className="flex items-center">
                <div className="w-10 h-10 mr-4 flex items-center justify-center text-charcoal">
                    {integration.logo}
                </div>
                <div>
                    <p className="font-semibold text-base text-charcoal">{integration.name}</p>
                    <StatusIndicator />
                </div>
            </div>
            <ActionButton />
        </div>
    )
}

const Integrations: React.FC = () => {
    const { integrations, updateIntegrationStatus } = useContext(AppContext);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleAction = (id: string, currentStatus: Integration['status']) => {
        setProcessingId(id);
        const promise = new Promise<void>(resolve => setTimeout(resolve, 1500)); // Simulate API call

        let actionVerb: string;
        let newStatus: Integration['status'];
        let name = integrations.find(i => i.id === id)?.name || 'Integration';

        switch (currentStatus) {
            case 'Connected':
                actionVerb = 'Disconnecting';
                newStatus = 'Not Connected';
                break;
            case 'Needs Re-authentication':
                actionVerb = 'Re-authenticating';
                newStatus = 'Connected';
                break;
            case 'Not Connected':
                actionVerb = 'Connecting';
                newStatus = 'Connected';
                break;
        }

        toast.promise(promise, {
            loading: `${actionVerb}...`,
            success: () => {
                updateIntegrationStatus(id, newStatus);
                setProcessingId(null);
                return `${name} ${newStatus.toLowerCase()} successfully!`;
            },
            error: () => {
                setProcessingId(null);
                return `Failed to perform action.`;
            }
        });
    };

    const connected = integrations.filter(int => int.status !== 'Not Connected');
    const available = integrations.filter(int => int.status === 'Not Connected');
    
    return (
        <div className="container mx-auto">
            <h2 className="text-3xl sm:text-4xl font-light mb-6 text-charcoal">Integrations</h2>
            
            <div className="space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-charcoal mb-4 px-4">Connected</h3>
                    <div className="border border-gray-200 rounded-lg">
                        {connected.length > 0 ? connected.map(int => (
                            <IntegrationCard key={int.id} integration={int} onAction={handleAction} processing={processingId === int.id} />
                        )) : <p className="text-light-grey p-4">No connected integrations.</p>}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-charcoal mb-4 px-4">Available</h3>
                    <div className="border border-gray-200 rounded-lg">
                        {available.length > 0 ? available.map(int => (
                            <IntegrationCard key={int.id} integration={int} onAction={handleAction} processing={processingId === int.id} />
                        )) : <p className="text-light-grey p-4">All available integrations are connected.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Integrations;