import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

type Severity = 1 | 2 | 3 | 4;

const severityMap: Record<Severity, { status: 'info' | 'warning' | 'error' | 'success'; title: string }> = {
    1: { status: 'info', title: 'Info' },
    2: { status: 'warning', title: 'Warning' },
    3: { status: 'error', title: 'Error' },
    4: { status: 'success', title: 'Success' },
};

interface SeverityAlertProps {
    severity: Severity;
    text: string;
}

const SeverityAlert: React.FC<SeverityAlertProps> = ({ severity, text }) => {
    const { status, title } = severityMap[severity];

    return (
        <Alert status={status}>
            <AlertIcon />
            <AlertTitle mr={2}>{title}</AlertTitle>
            <AlertDescription>{text}</AlertDescription>
        </Alert>
    );
};

export default SeverityAlert;