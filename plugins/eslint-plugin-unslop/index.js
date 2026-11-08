/**
 * ESLint Plugin: eslint-plugin-unslop
 * Real-time IDE linting & AST enforcement to prevent AI UI slop.
 */

module.exports = {
  rules: {
    'no-ai-gradients': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow generic AI purple/indigo/pink gradients in className or style attributes',
          category: 'Best Practices',
          recommended: true
        },
        fixable: 'code',
        schema: []
      },
      create(context) {
        const GRADIENT_REGEX = /(from-indigo|from-purple|to-pink|to-violet|bg-gradient-to-r.*purple)/i;
        return {
          JSXAttribute(node) {
            if (node.name && node.name.name === 'className' && node.value && typeof node.value.value === 'string') {
              if (GRADIENT_REGEX.test(node.value.value)) {
                context.report({
                  node,
                  message: 'Zero-Slop Rule [UNSLOP-001]: Avoid clichéd AI purple/indigo gradients. Use product-grounded neutrals and a single deliberate accent.'
                });
              }
            }
          },
          Literal(node) {
            if (typeof node.value === 'string' && GRADIENT_REGEX.test(node.value)) {
              if (context.getSourceCode().getText(node).includes('class')) {
                context.report({
                  node,
                  message: 'Zero-Slop Rule [UNSLOP-001]: Avoid clichéd AI purple/indigo gradients.'
                });
              }
            }
          }
        };
      }
    },
    'no-ai-emoji-clutter': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Disallow AI cliché emojis (✨, 🚀, ⚡, 🔥) in headings and badges',
          category: 'Craft Quality',
          recommended: true
        },
        schema: []
      },
      create(context) {
        const EMOJI_REGEX = /[✨⚡🚀🔥💡🤖🔮]/u;
        return {
          JSXText(node) {
            if (EMOJI_REGEX.test(node.value)) {
              context.report({
                node,
                message: 'Zero-Slop Rule [UNSLOP-003]: Remove generic AI sparkle/rocket/fire emojis from UI chrome and text.'
              });
            }
          },
          Literal(node) {
            if (typeof node.value === 'string' && EMOJI_REGEX.test(node.value)) {
              context.report({
                node,
                message: 'Zero-Slop Rule [UNSLOP-003]: Remove generic AI sparkle/rocket/fire emojis.'
              });
            }
          }
        };
      }
    },
    'no-superlative-buzzwords': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Disallow AI superlative buzzwords like "supercharge" or "revolutionize"',
          category: 'Content/Copywriting',
          recommended: true
        },
        schema: []
      },
      create(context) {
        const BUZZWORD_REGEX = /\b(supercharge|revolutionize|unleash|empower|game-changer|seamlessly automates)\b/i;
        return {
          JSXText(node) {
            if (BUZZWORD_REGEX.test(node.value)) {
              context.report({
                node,
                message: 'Zero-Slop Rule [UNSLOP-004]: Replace hollow AI superlatives with specific, plain product facts.'
              });
            }
          },
          Literal(node) {
            if (typeof node.value === 'string' && BUZZWORD_REGEX.test(node.value)) {
              context.report({
                node,
                message: 'Zero-Slop Rule [UNSLOP-004]: Replace hollow AI superlatives with specific, plain product facts.'
              });
            }
          }
        };
      }
    }
  },
  configs: {
    recommended: {
      plugins: ['unslop'],
      rules: {
        'unslop/no-ai-gradients': 'error',
        'unslop/no-ai-emoji-clutter': 'error',
        'unslop/no-superlative-buzzwords': 'warn'
      }
    }
  }
};
