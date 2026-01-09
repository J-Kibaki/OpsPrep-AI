# Security Best Practices for OpsPrep AI

## Implemented Security Measures

### 1. Firestore Security Rules
- **User Data Isolation**: Users can only read/write their own profiles and activities
- **Authentication Required**: All database operations require valid Firebase authentication
- **Principle of Least Privilege**: Default deny for all unmatched paths

### 2. Input Sanitization
- **Prompt Injection Prevention**: All user inputs to AI are sanitized to prevent prompt injection attacks
- **File Upload Validation**: Resume uploads are limited in size and sanitized
- **XSS Prevention**: Additional sanitization layer on top of React's built-in protection
- **Control Character Removal**: Removal of null bytes and control characters

### 3. API Key Security
- **Environment Variables**: API keys stored in environment variables (never committed to git)
- **Client-Side Warning**: Keys are client-side visible - suitable for demo/development only
- **Production Recommendation**: Use server-side API proxies for production deployments

### 4. Rate Limiting
- **Client-Side Rate Limiting**: Basic rate limiting implemented (10 requests per minute)
- **Production Note**: Implement server-side rate limiting for production

### 5. Error Handling
- **Generic Error Messages**: User-facing errors don't expose internal details
- **Console Logging**: Detailed errors logged to console for debugging (sanitize in production)

## Security Recommendations for Production

### Critical Actions Required:

1. **Move API Keys to Backend**
   - Create a backend proxy for Gemini API calls
   - Keep API keys server-side only
   - Use Firebase Functions or similar serverless solution

2. **Implement Server-Side Rate Limiting**
   - Use Firebase Functions with rate limiting
   - Consider using services like Cloud Armor or similar WAF

3. **Add Content Security Policy**
   - Configure CSP headers in your hosting provider
   - Example CSP for Vite/Firebase Hosting:
     ```
     Content-Security-Policy: default-src 'self'; 
       script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
       style-src 'self' 'unsafe-inline'; 
       img-src 'self' data: https:; 
       connect-src 'self' https://*.googleapis.com https://*.firebaseio.com;
     ```

4. **Enable Firebase App Check**
   - Protects your backend resources from abuse
   - Verifies requests are coming from your legitimate app

5. **Implement Audit Logging**
   - Log all security-sensitive operations
   - Monitor for suspicious activity patterns

6. **Regular Dependency Updates**
   - Run `npm audit` regularly
   - Keep dependencies updated for security patches

7. **HTTPS Only**
   - Ensure all traffic uses HTTPS
   - Set up HSTS headers

8. **Input Validation on Backend**
   - Never trust client-side validation alone
   - Validate all inputs on the server side

## Current Security Limitations

### Known Limitations (Development/Demo Mode):
- API keys are client-side visible
- Rate limiting is client-side only (can be bypassed)
- No server-side input validation
- No DDoS protection
- Limited audit logging

### Data Privacy:
- User data stored in Firebase (ensure GDPR/compliance if applicable)
- Resume data should not contain sensitive PII in production
- Consider data encryption at rest for sensitive fields

## Security Testing

### Recommended Tests:
1. **Prompt Injection Testing**: Test with various prompt injection payloads
2. **XSS Testing**: Attempt XSS through all user input fields
3. **Authentication Testing**: Verify Firestore rules prevent unauthorized access
4. **Rate Limit Testing**: Verify rate limiting works as expected
5. **File Upload Testing**: Test with malformed/malicious file uploads

## Incident Response

### If Security Issue Detected:
1. Review firestore.rules for unauthorized access
2. Check Firebase Console for suspicious activity
3. Rotate API keys if compromised
4. Review application logs
5. Update security measures as needed

## Compliance Considerations

- **GDPR**: Implement data deletion, export, and consent mechanisms
- **CCPA**: Provide data access and deletion rights
- **SOC 2**: Consider if handling production data
- **Data Residency**: Firebase allows region selection for compliance

## Contact

For security issues, please follow responsible disclosure:
1. Do not open public GitHub issues for security vulnerabilities
2. Contact the repository owner directly
3. Allow reasonable time for fix before public disclosure
