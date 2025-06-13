import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { 
  Button, 
  Input, 
  TextArea, 
  Select, 
  Alert,
  Badge,
  StatusIndicator,
  Spinner,
  Modal
} from '../index';
import type { SelectOption } from '../types';

/**
 * SimpleExamples - Basic usage examples for all components
 * 
 * This file demonstrates simple, working examples of each component
 * without complex integrations that might break due to API differences.
 */

// Form Example Component
const FormExample: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    description: ''
  });

  const categoryOptions: SelectOption[] = [
    { value: 'general', label: 'General' },
    { value: 'technical', label: 'Technical' },
    { value: 'billing', label: 'Billing' }
  ];

  return (
    <div className="space-y-4 p-6 max-w-md border rounded-lg">
      <h3 className="text-lg font-semibold">Form Components</h3>
      
      <Input
        label="Name"
        placeholder="Enter your name"
        value={formData.name}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
      />

      <Select
        label="Category"
        placeholder="Select category"
        options={categoryOptions}
        value={formData.category}
        onChange={(value) => setFormData(prev => ({ ...prev, category: value as string }))}
      />

      <TextArea
        label="Description"
        placeholder="Enter description"
        rows={3}
        value={formData.description}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
      />

      <Button variant="primary" className="w-full">
        Submit Form
      </Button>
    </div>
  );
};

// Buttons Example
const ButtonExample: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Button Variants</h3>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant="primary" 
          loading={loading}
          onClick={handleAsyncAction}
        >
          {loading ? 'Loading...' : 'Async Action'}
        </Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
      </div>
    </div>
  );
};

// Status and Badges Example
const StatusExample: React.FC = () => {
  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Status Indicators & Badges</h3>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Status Indicators:</h4>
        <div className="flex flex-wrap gap-3">
          <StatusIndicator status="active" pulse />
          <StatusIndicator status="inactive" />
          <StatusIndicator status="pending" pulse />
          <StatusIndicator status="success" />
          <StatusIndicator status="error" />
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Badges:</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="solid" color="blue">Active</Badge>
          <Badge variant="outline" color="gray">Inactive</Badge>
          <Badge variant="soft" color="green">Success</Badge>
          <Badge variant="solid" color="red">Error</Badge>
          <Badge variant="outline" color="yellow">Warning</Badge>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Loading States:</h4>
        <div className="flex items-center gap-4">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </div>
    </div>
  );
};

// Alerts Example
const AlertExample: React.FC = () => {
  const [alerts, setAlerts] = useState({
    success: true,
    error: true,
    warning: true,
    info: true
  });

  const dismissAlert = (type: keyof typeof alerts) => {
    setAlerts(prev => ({ ...prev, [type]: false }));
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Alert Messages</h3>
      
      {alerts.success && (
        <Alert 
          variant="success" 
          dismissible
          onDismiss={() => dismissAlert('success')}
        >
          Operation completed successfully!
        </Alert>
      )}

      {alerts.error && (
        <Alert 
          variant="error"
          dismissible
          onDismiss={() => dismissAlert('error')}
        >
          An error occurred. Please try again.
        </Alert>
      )}

      {alerts.warning && (
        <Alert 
          variant="warning"
          dismissible
          onDismiss={() => dismissAlert('warning')}
        >
          Please review your settings before continuing.
        </Alert>
      )}

      {alerts.info && (
        <Alert 
          variant="info"
          dismissible
          onDismiss={() => dismissAlert('info')}
        >
          New features are available. Check them out!
        </Alert>
      )}
    </div>
  );
};

// Modal Example
const ModalExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Modal Dialog</h3>
      
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is an example modal dialog with proper focus management 
            and accessibility features.
          </p>
          
          <Alert variant="info">
            Press ESC to close this modal or click the backdrop.
          </Alert>

          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Note: Toast examples are available in the complex examples
// This simple version focuses on basic component usage

// Main Examples Component
export const SimpleExamples: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Shared Components Library
        </h1>
        <p className="text-gray-600">
          Simple examples demonstrating each component in the library
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormExample />
        <ButtonExample />
        <StatusExample />
        <AlertExample />
        <ModalExample />
      </div>

      {/* Implementation Notes */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Implementation Notes</h2>
        <div className="text-sm space-y-2">
          <p><strong>TypeScript:</strong> All components are fully typed with comprehensive interfaces</p>
          <p><strong>Accessibility:</strong> WCAG 2.1 AA compliance with proper ARIA labels and keyboard navigation</p>
          <p><strong>Responsive:</strong> Components adapt to different screen sizes automatically</p>
          <p><strong>Theming:</strong> Consistent design system using Tailwind CSS utilities</p>
          <p><strong>Performance:</strong> Optimized with React.memo and efficient re-rendering</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleExamples;