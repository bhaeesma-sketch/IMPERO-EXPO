import { useEffect } from 'react';
import { useLocation } from 'wouter';

export function useAnalytics() {
    const [location] = useLocation();

    // Track page views
    useEffect(() => {
        logEvent('PAGE_VIEW', { path: location });
    }, [location]);

    const logEvent = async (eventType: string, details: any = {}) => {
        try {
            await fetch('/api/analytics/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventType, details }),
            });
        } catch (error) {
            console.error('Failed to log analytics event:', error);
        }
    };

    return { logEvent };
}
