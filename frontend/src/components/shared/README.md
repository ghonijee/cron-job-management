# Shared Components Library

A comprehensive, TypeScript-strict, accessible UI component library for the Cron Jobs Management application.

## Overview

This library provides a complete set of reusable components built with:

- **React 18+** with TypeScript
- **Tailwind CSS** for styling
- **WCAG 2.1 AA** accessibility compliance
- **Full keyboard navigation** support
- **Mobile-responsive** design
- **Performance-optimized** implementations

## Components

### Core Components

- **Button** - Action buttons with variants, sizes, and loading states
- **Input** - Text input with validation and accessibility
- **TextArea** - Multi-line text input
- **Select** - Dropdown selection with search support
- **Modal** - Dialog system with focus management
- **Table** - Data tables with sorting and selection
- **Card** - Content containers with sections

### Feedback Components

- **Alert** - Status messages and notifications
- **Toast** - Non-blocking notifications with auto-dismiss
- **Badge** - Status indicators and labels
- **StatusIndicator** - Visual status with icons and animations

### Loading Components

- **Spinner** - Loading indicators
- **Skeleton** - Content placeholders

## Quick Start

```typescript
import { 
  Button, 
  Input, 
  Modal, 
  Alert,
  ToastProvider 
} from '@/components/shared';

function MyComponent() {
  return (
    <ToastProvider>
      <div className="space-y-4">
        <Button variant="primary" size="lg">
          Click me
        </Button>
        
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
        />
        
        <Alert variant="success">
          Operation completed successfully!
        </Alert>
      </div>
    </ToastProvider>
  );
}
```

## Component Categories

### Form Components

All form components support validation, error states, and accessibility features:

```typescript
// Basic input
<Input
  label="Username"
  placeholder="Enter username"
  required
  error="Username is required"
/>

// Text area
<TextArea
  label="Description"
  rows={4}
  placeholder="Enter description"
/>

// Select dropdown
<Select
  label="Category"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  placeholder="Select category"
/>
```

### Action Components

```typescript
// Primary action button
<Button variant="primary" size="lg" loading={isLoading}>
  Save Changes
</Button>

// Secondary button with icon
<Button variant="secondary" icon={<PlusIcon />}>
  Add Item
</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>
  Delete
</Button>
```

### Layout Components

```typescript
// Modal dialog
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  size="md"
>
  <p>Are you sure you want to continue?</p>
  <div className="flex gap-2 mt-4">
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
    <Button variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
  </div>
</Modal>

// Card container
<Card>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Content>
    <p>Card content goes here</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>
```

### Data Components

```typescript
// Data table
<Table
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ]}
  data={tableData}
  selectable
  onSort={handleSort}
  onSelect={handleSelect}
/>
```

### Feedback Components

```typescript
// Alert messages
<Alert variant="success" dismissible onDismiss={handleDismiss}>
  Operation completed successfully!
</Alert>

<Alert variant="error">
  An error occurred. Please try again.
</Alert>

// Status indicators
<StatusIndicator
  status="active"
  pulse
  text="System Online"
/>

<StatusIndicator
  status="error"
  variant="detailed"
  text="Connection Failed"
/>

// Badges
<Badge variant="solid" color="green">
  Active
</Badge>

<Badge variant="outline" color="red" removable onRemove={handleRemove}>
  Error
</Badge>
```

### Loading Components

```typescript
// Loading spinner
<Spinner size="lg" />
<Spinner size="sm" overlay />

// Content skeletons
<Skeleton className="h-4 w-full" />
<Skeleton className="h-32 w-full" />
<Skeleton.List lines={3} />
```

### Toast Notifications

```typescript
import { useToast } from '@/components/shared/Toast';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast({
      title: 'Success!',
      description: 'Operation completed successfully',
      variant: 'success'
    });
  };

  const handleError = () => {
    showToast({
      title: 'Error',
      description: 'Something went wrong',
      variant: 'error',
      duration: 5000
    });
  };

  return (
    <div>
      <Button onClick={handleSuccess}>Show Success</Button>
      <Button onClick={handleError}>Show Error</Button>
    </div>
  );
}
```

## Accessibility Features

All components include:

- **ARIA labels and roles** for screen readers
- **Keyboard navigation** support (Tab, Enter, Escape, Arrow keys)
- **Focus management** and visual focus indicators
- **High contrast** support
- **Reduced motion** preferences respected
- **Screen reader** announcements for dynamic content

## Responsive Design

Components automatically adapt to different screen sizes:

- **Mobile-first** design approach
- **Touch-friendly** interactive elements
- **Flexible layouts** using CSS Grid and Flexbox
- **Breakpoint-aware** component variations

## Performance

- **Lazy loading** for large components
- **Optimized re-renders** with React.memo
- **Minimal bundle impact** with tree-shaking
- **Efficient animations** using CSS transforms
- **Virtualization** for large lists

## Theming

Components support consistent theming through Tailwind CSS:

```css
/* Custom theme colors can be added to tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      }
    }
  }
}
```

## TypeScript Support

All components are fully typed with comprehensive interfaces:

```typescript
// Component props are strictly typed
interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: LucideIcon | ReactNode;
}

// Consistent base props across components
interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}
```

## Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS Safari 14+, Chrome Mobile 90+)

## Best Practices

### Component Usage

1. **Import only what you need** for optimal bundle size
2. **Use semantic HTML** elements when possible
3. **Provide meaningful labels** for accessibility
4. **Handle loading and error states** appropriately
5. **Follow consistent spacing** using Tailwind classes

### Performance Tips

1. **Wrap expensive components** with React.memo
2. **Use callback memoization** for event handlers
3. **Lazy load modals** and heavy components
4. **Debounce user inputs** in search/filter components

### Accessibility Guidelines

1. **Always provide labels** for form controls
2. **Use appropriate ARIA roles** and properties
3. **Ensure keyboard navigation** works correctly
4. **Test with screen readers** regularly
5. **Maintain sufficient color contrast** (4.5:1 minimum)

## Contributing

When adding new components:

1. **Follow the established patterns** in existing components
2. **Include comprehensive TypeScript types**
3. **Add accessibility features** from the start
4. **Write tests** for critical functionality
5. **Update documentation** with examples
6. **Test on multiple devices** and screen sizes

## Testing

Components can be tested using React Testing Library:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('should handle click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Migration Guide

When upgrading components:

1. **Check breaking changes** in component APIs
2. **Update import statements** if needed
3. **Test accessibility** after changes
4. **Verify responsive behavior** on all screen sizes
5. **Update TypeScript types** if modified

---

For questions or issues, please refer to the project documentation or create an issue in the project repository.