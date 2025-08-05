#!/usr/bin/env node

console.log("🔗 BlockNote + AI Extension Integration Example\n");

async function showIntegrationExample() {
  try {
    // Import both BlockNote core and our AI extension
    const { getDefaultSlashMenuItems } = await import("@blocknote/core");
    const { getAISlashMenuItems } = await import("./dist/ai-slash.js");

    console.log("✅ Both extensions imported successfully\n");

    // Create a mock editor (in real usage, this would be your actual BlockNote editor)
    const mockEditor = {
      getSelectedText: () => "test text",
      getTextCursorPosition: () => ({ block: { id: "test" } }),
      insertBlocks: () => [{ id: "new-block" }],
      updateBlock: () => {},
      setTextCursorPosition: () => {},
      removeBlocks: () => {},
      focus: () => {},
      getSelection: () => null,
      insertInlineContent: () => {},
      addStyles: () => {},
      removeStyles: () => {},
      toggleStyles: () => {},
      getActiveStyles: () => ({}),
    };

    // AI command handler
    const handleAICommand = (action, payload) => {
      console.log(`🤖 AI Command: ${action}`, payload);
      // In your real app, this would call your AI API
    };

    // Get all commands
    const defaultCommands = getDefaultSlashMenuItems(mockEditor);
    const aiCommands = getAISlashMenuItems(mockEditor, handleAICommand);

    // Combine all commands
    const allCommands = [...defaultCommands, ...aiCommands];

    console.log("📊 Command Summary:");
    console.log(`- Default BlockNote commands: ${defaultCommands.length}`);
    console.log(`- AI extension commands: ${aiCommands.length}`);
    console.log(`- Total combined commands: ${allCommands.length}\n`);

    // Show all available commands grouped by type
    const commandGroups = {};
    allCommands.forEach((cmd) => {
      const group = cmd.group || "Other";
      if (!commandGroups[group]) {
        commandGroups[group] = [];
      }
      commandGroups[group].push(cmd.key);
    });

    console.log("🎯 All Available Slash Commands:");
    console.log("================================\n");

    Object.entries(commandGroups).forEach(([group, commands]) => {
      console.log(`${group}:`);
      commands.forEach((cmd) => {
        const isAI = group === "AI";
        console.log(`  /${cmd}${isAI ? " 🤖" : ""}`);
      });
      console.log("");
    });

    // Show specific important commands
    console.log("✨ Key Commands You Can Use:");
    console.log("============================\n");

    const keyCommands = [
      { key: "paragraph", desc: "Regular text block" },
      { key: "heading", desc: "Heading (H1, H2, H3)" },
      { key: "bulletListItem", desc: "Bullet list item" },
      { key: "numberedListItem", desc: "Numbered list item" },
      { key: "quote", desc: "Quote block" },
      { key: "code", desc: "Code block" },
      { key: "image", desc: "Image block" },
      { key: "table", desc: "Table" },
      { key: "divider", desc: "Horizontal divider" },
      { key: "explain", desc: "AI: Explain selected text 🤖" },
      { key: "quiz-me", desc: "AI: Generate quiz 🤖" },
      { key: "summarize", desc: "AI: Summarize text 🤖" },
      { key: "diagram", desc: "AI: Create diagram 🤖" },
    ];

    keyCommands.forEach((cmd) => {
      const isAI = cmd.desc.includes("🤖");
      console.log(`/${cmd.key} - ${cmd.desc}`);
    });

    console.log("\n🚀 Integration Code Example:");
    console.log("============================\n");
    console.log("// In your BlockNote editor setup:");
    console.log("import { getDefaultSlashMenuItems } from '@blocknote/core';");
    console.log(
      "import { getAISlashMenuItems } from '@blocknote/extension-ai-slash';",
    );
    console.log("");
    console.log("const editor = new BlockNoteEditor({");
    console.log("  slashMenuItems: [");
    console.log(
      "    ...getDefaultSlashMenuItems(editor), // All original commands",
    );
    console.log(
      "    ...getAISlashMenuItems(editor, handleAICommand) // AI commands",
    );
    console.log("  ]");
    console.log("});");
    console.log("");
    console.log("function handleAICommand(action, payload) {");
    console.log("  // Connect to your AI API here");
    console.log("  console.log('AI Command:', action, payload);");
    console.log("}");

    console.log("\n🎉 Integration Complete!");
    console.log(
      "Your users can now use ALL BlockNote commands PLUS AI commands!",
    );
  } catch (error) {
    console.error("❌ Integration example failed:", error.message);
    process.exit(1);
  }
}

showIntegrationExample();
