import { useEffect } from 'react';

export const DynamicTheme = () => {
    useEffect(() => {
        const updateDynamicTheme = () => {
            const now = new Date();
            const hours = now.getHours();
            const root = document.documentElement;

            // Reset dynamic classes
            root.classList.remove('theme-golden-hour', 'theme-midnight');

            if (hours >= 17 && hours < 20) {
                // Golden Hour (5 PM - 8 PM)
                root.classList.add('theme-golden-hour');
            } else if (hours >= 20 || hours < 5) {
                // Midnight (8 PM - 5 AM)
                root.classList.add('theme-midnight');
            }
        };

        updateDynamicTheme();
        const interval = setInterval(updateDynamicTheme, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return null;
};
