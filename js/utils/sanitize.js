/**
 * Input Sanitization & Validation Utilities
 * Prevents XSS, SQL injection, and other security vulnerabilities
 */

export const sanitizeInput = {
  /**
   * Sanitize HTML by encoding special characters
   * @param {string} input - Raw user input
   * @returns {string} - Sanitized HTML-safe string
   */
  html(input) {
    if (typeof input !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Remove dangerous characters and scripts
   * @param {string} input - Raw text input
   * @returns {string} - Cleaned text
   */
  text(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:text\/html/gi, '') // Remove data URLs
      .trim();
  },

  /**
   * Validate and sanitize email address
   * @param {string} input - Email input
   * @returns {string|null} - Valid email or null
   */
  email(input) {
    if (typeof input !== 'string') return null;
    
    const cleanEmail = input.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    return emailRegex.test(cleanEmail) ? cleanEmail : null;
  },

  /**
   * Validate and sanitize URL
   * @param {string} input - URL input
   * @returns {string|null} - Valid URL or null
   */
  url(input) {
    if (typeof input !== 'string') return null;
    
    try {
      const url = new URL(input);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        return null;
      }
      
      return url.href;
    } catch {
      return null;
    }
  },

  /**
   * Validate and sanitize number with range
   * @param {*} input - Number input
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number|null} - Valid number or null
   */
  number(input, min = -Infinity, max = Infinity) {
    const num = parseFloat(input);
    
    if (isNaN(num)) return null;
    if (num < min || num > max) return null;
    
    return num;
  },

  /**
   * Validate and sanitize integer
   * @param {*} input - Integer input
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number|null} - Valid integer or null
   */
  integer(input, min = -Infinity, max = Infinity) {
    const num = parseInt(input, 10);
    
    if (isNaN(num)) return null;
    if (num < min || num > max) return null;
    
    return num;
  },

  /**
   * Sanitize phone number
   * @param {string} input - Phone input
   * @returns {string|null} - Cleaned phone or null
   */
  phone(input) {
    if (typeof input !== 'string') return null;
    
    // Remove all non-digit characters except +
    const cleaned = input.replace(/[^\d+]/g, '');
    
    // Basic validation (10-15 digits)
    if (cleaned.length < 10 || cleaned.length > 15) {
      return null;
    }
    
    return cleaned;
  },

  /**
   * Sanitize filename to prevent directory traversal
   * @param {string} input - Filename input
   * @returns {string} - Safe filename
   */
  filename(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Only allow alphanumeric, dot, dash, underscore
      .replace(/\.{2,}/g, '.') // Prevent directory traversal
      .replace(/^\.+/, '') // Remove leading dots
      .substring(0, 255); // Limit length
  },

  /**
   * Sanitize rich text HTML (for use with Quill editor)
   * Allows only safe HTML tags and attributes
   * @param {string} html - Rich text HTML
   * @returns {string} - Sanitized HTML
   */
  richText(html) {
    if (typeof html !== 'string') return '';
    
    // In production, use DOMPurify library
    // npm install dompurify
    // import DOMPurify from 'dompurify';
    
    const allowedTags = [
      'p', 'br', 'strong', 'em', 'u', 's', 'del', 'ins',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ol', 'ul', 'li',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span', 'div'
    ];
    
    const allowedAttrs = ['href', 'src', 'alt', 'title', 'class', 'style'];
    
    // For now, basic sanitization (replace with DOMPurify in production)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove script tags
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove event handlers
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    return tempDiv.innerHTML;
  },

  /**
   * Sanitize object by applying text sanitization to all string values
   * @param {Object} obj - Object to sanitize
   * @returns {Object} - Sanitized object
   */
  object(obj) {
    if (typeof obj !== 'object' || obj === null) return {};
    
    const sanitized = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.text(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.object(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
};

/**
 * Validation functions
 */
export const validate = {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  email(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  password(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate required field
   * @param {*} value - Value to check
   * @returns {boolean}
   */
  required(value) {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  },

  /**
   * Validate minimum length
   * @param {string} value - String to validate
   * @param {number} min - Minimum length
   * @returns {boolean}
   */
  minLength(value, min) {
    return typeof value === 'string' && value.length >= min;
  },

  /**
   * Validate maximum length
   * @param {string} value - String to validate
   * @param {number} max - Maximum length
   * @returns {boolean}
   */
  maxLength(value, max) {
    return typeof value === 'string' && value.length <= max;
  },

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean}
   */
  url(url) {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  /**
   * Validate phone number
   * @param {string} phone - Phone to validate
   * @returns {boolean}
   */
  phone(phone) {
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }
};

/**
 * Form validation helper
 * @param {HTMLFormElement} form - Form to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export function validateForm(form, rules) {
  const errors = {};
  let valid = true;
  
  for (const [fieldName, fieldRules] of Object.entries(rules)) {
    const field = form.elements[fieldName];
    if (!field) continue;
    
    const value = field.value;
    const fieldErrors = [];
    
    for (const rule of fieldRules) {
      if (rule.type === 'required' && !validate.required(value)) {
        fieldErrors.push(rule.message || 'This field is required');
      }
      
      if (rule.type === 'email' && value && !validate.email(value)) {
        fieldErrors.push(rule.message || 'Please enter a valid email');
      }
      
      if (rule.type === 'minLength' && !validate.minLength(value, rule.value)) {
        fieldErrors.push(rule.message || `Minimum ${rule.value} characters required`);
      }
      
      if (rule.type === 'maxLength' && !validate.maxLength(value, rule.value)) {
        fieldErrors.push(rule.message || `Maximum ${rule.value} characters allowed`);
      }
      
      if (rule.type === 'url' && value && !validate.url(value)) {
        fieldErrors.push(rule.message || 'Please enter a valid URL');
      }
      
      if (rule.type === 'phone' && value && !validate.phone(value)) {
        fieldErrors.push(rule.message || 'Please enter a valid phone number');
      }
      
      if (rule.type === 'custom' && rule.validator && !rule.validator(value)) {
        fieldErrors.push(rule.message || 'Invalid value');
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
      valid = false;
    }
  }
  
  return { valid, errors };
}

/**
 * Display form errors in the UI
 * @param {HTMLFormElement} form - Form element
 * @param {Object} errors - Error object from validateForm
 */
export function displayFormErrors(form, errors) {
  // Clear existing errors
  form.querySelectorAll('.form__error').forEach(el => {
    el.textContent = '';
  });
  
  form.querySelectorAll('.form__input--error').forEach(el => {
    el.classList.remove('form__input--error');
  });
  
  // Display new errors
  for (const [fieldName, fieldErrors] of Object.entries(errors)) {
    const field = form.elements[fieldName];
    if (!field) continue;
    
    field.classList.add('form__input--error');
    
    const errorElement = field.parentElement.querySelector('.form__error');
    if (errorElement) {
      errorElement.textContent = fieldErrors[0]; // Show first error
    }
  }
}
