# Privacy Compliance Guide

This document provides comprehensive guidance on implementing privacy compliance features in the Hugo theme, including GDPR compliance, cookie consent management, and user rights implementation.

## Table of Contents

- [Overview](#overview)
- [GDPR Compliance](#gdpr-compliance)
- [Cookie Consent Management](#cookie-consent-management)
- [User Rights Implementation](#user-rights-implementation)
- [Privacy Policy Integration](#privacy-policy-integration)
- [Configuration Options](#configuration-options)
- [Implementation Examples](#implementation-examples)
- [Testing Privacy Features](#testing-privacy-features)
- [Legal Considerations](#legal-considerations)

## Overview

The theme includes comprehensive privacy and consent management features designed to help you comply with privacy regulations such as GDPR, CCPA, and other data protection laws.

### Key Features

- **Do Not Track Respect**: Automatically disables tracking when DNT is enabled
- **Cookie Consent Management**: GDPR-compliant consent banners and settings
- **User Rights Implementation**: Data export, deletion, and consent management
- **Privacy Policy Generation**: Automatic privacy policy based on enabled services
- **Granular Consent**: Separate consent for analytics, advertising, and performance
- **Data Processing Transparency**: Clear information about data collection and use

## GDPR Compliance

### Legal Basis for Processing

The theme supports different legal bases for data processing:

1. **Legitimate Interest**: Essential website functions, security, performance
2. **Consent**: Analytics, advertising, marketing (when cookie consent is enabled)
3. **Contract**: User account management (if applicable)

### Data Processing Principles

- **Lawfulness, Fairness, and Transparency**: Clear information about data collection
- **Purpose Limitation**: Data used only for specified purposes
- **Data Minimization**: Collect only necessary data
- **Accuracy**: Mechanisms to correct inaccurate data
- **Storage Limitation**: Automatic consent expiry and data retention policies
- **Integrity and Confidentiality**: Security measures for data protection
- **Accountability**: Documentation and compliance monitoring

### Configuration for GDPR Compliance

```toml
[params.privacy]
  respectDoNotTrack = true
  cookieConsent = true
  anonymizeIP = true
  
  [params.privacy.consentBanner]
    enabled = true
    message = "We use cookies and similar technologies to enhance your experience."
    acceptText = "Accept All"
    declineText = "Reject All"
    settingsText = "Cookie Settings"
    learnMoreText = "Privacy Policy"
    learnMoreUrl = "/privacy-policy"
    
  # Contact information for data protection
  contactEmail = "privacy@yoursite.com"
  contactAddress = "Your Address"
  dpoEmail = "dpo@yoursite.com"  # Data Protection Officer
```

## Cookie Consent Management

### Consent Categories

The theme implements granular consent for different categories:

1. **Essential/Functional**: Always active, cannot be disabled
2. **Analytics**: Google Analytics, performance monitoring
3. **Advertising**: AdSense, Facebook Pixel, marketing cookies
4. **Performance**: Optimization and enhancement cookies

### Consent Banner Features

- **GDPR-Compliant Design**: Clear language and prominent placement
- **Granular Controls**: Individual category management
- **Consent Persistence**: Remembers user choices with expiry
- **Easy Withdrawal**: Simple consent modification and withdrawal
- **Mobile Responsive**: Works on all device sizes

### Implementation

```html
<!-- Include in your base template -->
{{ partial "privacy/consent-manager.html" . }}
{{ partial "privacy/gdpr-helpers.html" . }}
```

### Consent States

- **No Decision**: Banner shown, no tracking active
- **Accepted**: All selected services active
- **Rejected**: Only essential cookies active
- **Custom**: User-selected categories active

## User Rights Implementation

### GDPR Article 15: Right of Access

Users can download their data:

```javascript
// Trigger data export
window.ThemeGDPR.exportUserData();
```

### GDPR Article 17: Right to Erasure

Users can delete their data:

```javascript
// Delete all user data
window.ThemeGDPR.deleteUserData();
```

### GDPR Article 21: Right to Object

Users can object to specific processing:

```javascript
// Object to analytics processing
window.ThemeGDPR.objectToProcessing('analytics');
```

### GDPR Article 7: Consent Withdrawal

Users can withdraw consent:

```javascript
// Withdraw all consent
window.ThemePrivacy.revokeAllConsent();

// Withdraw specific consent
window.ThemePrivacy.revokeConsent('advertising');
```

## Privacy Policy Integration

### Automatic Privacy Policy Generation

The theme can generate a privacy policy based on your configuration:

```markdown
---
title: "Privacy Policy"
layout: "privacy-policy"
---

<!-- Custom content here, or leave empty for auto-generated policy -->
```

### Privacy Policy Features

- **Service-Specific Sections**: Automatically includes sections for enabled services
- **Legal Basis Information**: Clear explanation of processing grounds
- **Third-Party Services**: Information about external service providers
- **User Rights**: Comprehensive list of GDPR rights
- **Interactive Controls**: Direct access to privacy management tools

### Customization

Create custom privacy policy content:

```markdown
---
title: "Privacy Policy"
date: 2024-01-01
---

# Custom Privacy Policy

Your custom privacy policy content here...

The theme will still add interactive privacy controls and contact information.
```

## Configuration Options

### Complete Privacy Configuration

```toml
[params.privacy]
  # Basic privacy settings
  respectDoNotTrack = true
  cookieConsent = true
  anonymizeIP = true
  disableTracking = false
  
  # Cookie consent banner
  [params.privacy.consentBanner]
    enabled = true
    title = "Cookie Consent"
    message = "We use cookies to enhance your experience and analyze our traffic."
    acceptText = "Accept All"
    declineText = "Reject All"
    settingsText = "Cookie Settings"
    learnMoreText = "Privacy Policy"
    learnMoreUrl = "/privacy-policy"
    
  # Contact information (required for GDPR)
  contactEmail = "privacy@yoursite.com"
  contactAddress = "123 Privacy Street, Data City, DC 12345"
  contactPhone = "+1-555-PRIVACY"
  dpoEmail = "dpo@yoursite.com"
  
  # Data retention periods (optional)
  analyticsRetention = "26 months"
  advertisingRetention = "13 months"
  functionalRetention = "session"
```

### Service-Specific Privacy Settings

```toml
# Google Analytics with privacy settings
GoogleAnalyticsID = "G-XXXXXXXXXX"

[privacy.googleAnalytics]
  respectDoNotTrack = true
  anonymizeIP = true
  useSessionStorage = false

# AdSense with privacy compliance
[params.adsense]
  enabled = true
  client = "ca-pub-XXXXXXXXXXXXXXXX"
  respectPrivacy = true

# Facebook Pixel with consent management
[params.facebookPixel]
  enabled = true
  pixelId = "XXXXXXXXXXXXXXX"
  respectConsent = true
```

## Implementation Examples

### Basic Privacy Setup

```toml
# Minimal privacy-compliant setup
[params.privacy]
  respectDoNotTrack = true
  cookieConsent = true
  
  [params.privacy.consentBanner]
    enabled = true
    
  contactEmail = "privacy@yoursite.com"
```

### Full GDPR Compliance

```toml
# Complete GDPR compliance setup
[params.privacy]
  respectDoNotTrack = true
  cookieConsent = true
  anonymizeIP = true
  
  [params.privacy.consentBanner]
    enabled = true
    message = "We process personal data to improve your experience. By clicking 'Accept', you consent to our use of cookies and data processing as described in our Privacy Policy."
    acceptText = "Accept All Cookies"
    declineText = "Reject Non-Essential"
    settingsText = "Manage Preferences"
    learnMoreText = "Read Privacy Policy"
    learnMoreUrl = "/privacy-policy"
    
  contactEmail = "privacy@yourcompany.com"
  contactAddress = "Data Protection Team, Your Company Ltd, 123 Business St, City, Country"
  dpoEmail = "dpo@yourcompany.com"

# Ensure all services respect privacy settings
[privacy.googleAnalytics]
  respectDoNotTrack = true
  anonymizeIP = true

[privacy.youtube]
  privacyEnhanced = true
```

### Privacy-First Configuration

```toml
# Maximum privacy protection
[params.privacy]
  respectDoNotTrack = true
  cookieConsent = true
  anonymizeIP = true
  disableTracking = false  # Allow with consent
  
  [params.privacy.consentBanner]
    enabled = true
    message = "This website respects your privacy. We only use essential cookies by default. You can choose to enable additional features."
    acceptText = "Enable All Features"
    declineText = "Essential Only"
    settingsText = "Choose Features"
    
  contactEmail = "privacy@yoursite.com"

# Disable advertising by default
[params.adsense]
  enabled = false

[params.facebookPixel]
  enabled = false
```

## Testing Privacy Features

### Manual Testing Checklist

1. **Do Not Track Testing**
   - Enable DNT in browser settings
   - Verify no tracking scripts load
   - Check console for privacy messages

2. **Cookie Consent Testing**
   - Clear browser data
   - Visit site and verify banner appears
   - Test accept/reject/settings flows
   - Verify consent persistence

3. **User Rights Testing**
   - Test data export functionality
   - Test data deletion
   - Test consent withdrawal
   - Verify consent settings modal

4. **Cross-Browser Testing**
   - Test on Chrome, Firefox, Safari, Edge
   - Test on mobile devices
   - Verify responsive design

### Automated Testing

```javascript
// Test privacy functions
describe('Privacy Management', () => {
  test('respects Do Not Track', () => {
    // Mock DNT enabled
    Object.defineProperty(navigator, 'doNotTrack', { value: '1' });
    expect(window.ThemePrivacy.doNotTrack()).toBe(true);
  });
  
  test('manages consent properly', () => {
    window.ThemePrivacy.grantConsent('analytics');
    expect(window.ThemePrivacy.hasConsent('analytics')).toBe(true);
    
    window.ThemePrivacy.revokeConsent('analytics');
    expect(window.ThemePrivacy.hasConsent('analytics')).toBe(false);
  });
});
```

### Privacy Audit Tools

1. **Browser Developer Tools**: Check for tracking scripts and cookies
2. **Privacy Badger**: Verify tracking protection
3. **Ghostery**: Monitor third-party scripts
4. **GDPR Compliance Checkers**: Automated compliance scanning

## Legal Considerations

### Important Disclaimers

⚠️ **Legal Disclaimer**: This theme provides technical tools for privacy compliance but does not constitute legal advice. Always consult with qualified legal professionals for compliance requirements in your jurisdiction.

### Compliance Requirements

1. **GDPR (EU)**: Requires explicit consent for non-essential cookies
2. **CCPA (California)**: Requires opt-out mechanisms for data sales
3. **PIPEDA (Canada)**: Requires meaningful consent for data collection
4. **LGPD (Brazil)**: Similar to GDPR with specific Brazilian requirements

### Best Practices

1. **Regular Audits**: Review privacy practices regularly
2. **Staff Training**: Ensure team understands privacy requirements
3. **Documentation**: Maintain records of processing activities
4. **Incident Response**: Have procedures for data breaches
5. **Privacy by Design**: Consider privacy in all development decisions

### Recommended Actions

1. **Legal Review**: Have your privacy policy reviewed by legal counsel
2. **Data Mapping**: Document all data collection and processing
3. **Vendor Agreements**: Ensure third-party services are compliant
4. **Regular Updates**: Keep privacy policies and practices current
5. **User Education**: Provide clear information about data practices

## Support and Resources

### Documentation

- [Configuration Reference](configuration-reference.md)
- [Configuration Examples](configuration-examples.md)
- [Troubleshooting Guide](troubleshooting.md)

### External Resources

- [GDPR Official Text](https://gdpr-info.eu/)
- [Google Analytics Privacy](https://support.google.com/analytics/answer/6004245)
- [Facebook Privacy Policy](https://www.facebook.com/privacy/explanation)
- [Privacy Policy Generators](https://www.privacypolicygenerator.info/)

### Getting Help

If you need assistance with privacy compliance:

1. Review the theme documentation
2. Check configuration examples
3. Consult with legal professionals
4. Consider privacy compliance services
5. Join privacy-focused developer communities

Remember: Privacy compliance is an ongoing process, not a one-time setup. Regularly review and update your privacy practices as regulations and your website evolve.