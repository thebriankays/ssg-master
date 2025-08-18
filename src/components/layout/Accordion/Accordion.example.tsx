import React, { useState } from 'react'
import Accordion from './index'

export const AccordionExample = () => {
  // Uncontrolled single accordion
  const UncontrolledSingle = () => (
    <div className="example-section">
      <h3>Uncontrolled Single Accordion</h3>
      <Accordion type="single" defaultValue="item-1">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>What is an accordion component?</Accordion.Trigger>
          <Accordion.Content>
            An accordion is a UI component that organizes content into collapsible sections,
            allowing users to toggle the visibility of content panels.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>How does it improve UX?</Accordion.Trigger>
          <Accordion.Content>
            Accordions help reduce cognitive load by hiding non-essential information while keeping
            it easily accessible. They're perfect for FAQs, settings panels, and content-heavy
            interfaces.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>When should I use accordions?</Accordion.Trigger>
          <Accordion.Content>
            Use accordions when you have related content that users don't need to see all at once,
            such as FAQ sections, product details, or step-by-step guides.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  )

  // Uncontrolled multiple accordion
  const UncontrolledMultiple = () => (
    <div className="example-section">
      <h3>Uncontrolled Multiple Accordion</h3>
      <Accordion type="multiple" defaultValue={['item-1', 'item-3']}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Section 1</Accordion.Trigger>
          <Accordion.Content>
            Multiple accordions allow several sections to be open simultaneously.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>Section 2</Accordion.Trigger>
          <Accordion.Content>
            This provides more flexibility for users who want to compare content.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>Section 3</Accordion.Trigger>
          <Accordion.Content>
            Users can open and close sections independently of each other.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  )

  // Controlled accordion
  const ControlledAccordion = () => {
    const [value, setValue] = useState<string>('item-2')

    return (
      <div className="example-section">
        <h3>Controlled Accordion</h3>
        <p>Current open item: {value || 'None'}</p>
        <Accordion type="single" value={value} onValueChange={(val) => setValue(Array.isArray(val) ? val[0] : val)}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Controlled Item 1</Accordion.Trigger>
            <Accordion.Content>
              This accordion's state is controlled by the parent component.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Controlled Item 2</Accordion.Trigger>
            <Accordion.Content>
              The parent component manages which item is open.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-3">
            <Accordion.Trigger>Controlled Item 3</Accordion.Trigger>
            <Accordion.Content>
              This allows for programmatic control of the accordion.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>
    )
  }

  // Different variants
  const Variants = () => (
    <div className="example-section">
      <h3>Accordion Variants</h3>
      
      <div style={{ marginBottom: '2rem' }}>
        <h4>Default Variant</h4>
        <Accordion variant="default" type="single">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Default Style</Accordion.Trigger>
            <Accordion.Content>
              This is the default accordion style with borders.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4>Bordered Variant</h4>
        <Accordion variant="bordered" type="single">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Bordered Item 1</Accordion.Trigger>
            <Accordion.Content>
              Each item has its own border and spacing.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Bordered Item 2</Accordion.Trigger>
            <Accordion.Content>
              This creates visual separation between items.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4>Separated Variant</h4>
        <Accordion variant="separated" type="single">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Separated Item 1</Accordion.Trigger>
            <Accordion.Content>
              Items have background colors and shadows.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Separated Item 2</Accordion.Trigger>
            <Accordion.Content>
              This creates a card-like appearance.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4>Flush Variant</h4>
        <Accordion variant="flush" type="single">
          <Accordion.Item value="item-1">
            <Accordion.Trigger>Flush Item 1</Accordion.Trigger>
            <Accordion.Content>
              Minimal styling with no side padding.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>Flush Item 2</Accordion.Trigger>
            <Accordion.Content>
              Perfect for integration into existing layouts.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  )

  // Disabled items
  const DisabledItems = () => (
    <div className="example-section">
      <h3>Disabled Items</h3>
      <Accordion type="single">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Active Item</Accordion.Trigger>
          <Accordion.Content>
            This item can be toggled normally.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2" disabled>
          <Accordion.Trigger>Disabled Item</Accordion.Trigger>
          <Accordion.Content>
            This content cannot be accessed.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>Another Active Item</Accordion.Trigger>
          <Accordion.Content>
            This item is also interactive.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  )

  // Custom icons
  const CustomIcons = () => (
    <div className="example-section">
      <h3>Custom Icons</h3>
      <Accordion type="single">
        <Accordion.Item value="item-1">
          <Accordion.Trigger icon={<span>+</span>} iconPosition="left">
            Left Icon Position
          </Accordion.Trigger>
          <Accordion.Content>
            The icon appears on the left side of the trigger.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger icon={<span>→</span>}>
            Custom Icon
          </Accordion.Trigger>
          <Accordion.Content>
            You can use any React node as an icon.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Accordion Component Examples</h1>
      <UncontrolledSingle />
      <UncontrolledMultiple />
      <ControlledAccordion />
      <Variants />
      <DisabledItems />
      <CustomIcons />
    </div>
  )
}

export default AccordionExample