/**
 * Zero-Slop Enterprise Design Tokens
 * Replaces arbitrary AI colors, fluorescent glows, and hyper-rounded cards
 * with deliberate optical contrast, quiet chrome, and structured typography.
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        // Quiet tinted neutrals
        canvas: {
          DEFAULT: '#090a0f',
          subtle: '#12141c',
          muted: '#1b1e2a'
        },
        border: {
          subtle: '#262a3b',
          strong: '#363c54'
        },
        // Single deliberate brand accent (Amber/Steel/Cyan options)
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          subtle: 'rgba(59, 130, 246, 0.12)'
        },
        // Calm high-legibility typography
        text: {
          primary: '#f3f4f6',
          secondary: '#9ca3af',
          muted: '#6b7280'
        }
      },
      boxShadow: {
        // Crisp, tight optical shadows (never high-radius colored blur orbs)
        'craft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'craft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'craft-focus': '0 0 0 1px #3b82f6'
      },
      borderRadius: {
        // Structured corners instead of infinite full-pill buttons
        'craft-sm': '6px',
        'craft-md': '8px',
        'craft-lg': '12px'
      }
    }
  }
};
