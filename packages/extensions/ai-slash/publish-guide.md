# Publishing Guide for AI Slash Extension

## 🚀 How to Publish as npm Package

### Step 1: Prepare for Publishing

```bash
# Make sure you're in the extension directory
cd packages/extensions/ai-slash

# Build the extension
npm run build

# Test that everything works
npm test
```

### Step 2: Update Package Name (Optional)

If you want to publish under your own namespace:

```bash
# Edit package.json and change the name
"name": "@danjari/blocknote-ai-extension"
# or
"name": "synapsed-ai-extension"
```

### Step 3: Publish to npm

```bash
# Login to npm (if not already logged in)
npm login

# Publish the package
npm publish

# If it's a scoped package (starts with @), use:
npm publish --access public
```

### Step 4: Use in Your Synapsed App

After publishing, you can install it in your Synapsed application:

```bash
# Install the published package
npm install @danjari/blocknote-ai-extension
# or whatever name you chose
```

```javascript
// Import in your Synapsed app
import { getAISlashMenuItems } from "@danjari/blocknote-ai-extension";
```

## 🔄 Development Workflow

### For Local Development:

1. **Work in the monorepo** (current setup)
2. **Import directly** from the built files
3. **Test changes** immediately

### For Production:

1. **Make changes** in the extension
2. **Build and test** locally
3. **Publish** to npm
4. **Update** your Synapsed app to use the new version

## 📦 Package Structure

Your published package will include:

```
@blocknote/extension-ai-slash/
├── dist/
│   ├── ai-slash.js          # ES Module build
│   ├── ai-slash.cjs         # CommonJS build
│   └── style.css            # Theme styles
├── types/                   # TypeScript definitions
├── src/                     # Source code
├── package.json
├── README.md
└── LICENSE
```

## 🎯 Recommended Approach

### Phase 1: Development (Current)

- Keep working in the BlockNote monorepo
- Import directly from `./packages/extensions/ai-slash/dist/ai-slash.js`
- Test and iterate quickly

### Phase 2: Production

- Publish to npm when ready
- Install in your Synapsed app
- Use proper versioning for updates

## 🔧 Version Management

```bash
# Update version before publishing
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0

# Then publish
npm publish
```

## 🚨 Important Notes

1. **Test thoroughly** before publishing
2. **Update README.md** with proper documentation
3. **Check license** is correct (MIT)
4. **Verify exports** in package.json
5. **Test installation** in a clean project

## 🎉 You're Ready!

Your AI extension is production-ready and can be published as an npm package whenever you want to use it in your Synapsed application!
