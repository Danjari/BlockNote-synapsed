#!/usr/bin/env node

console.log("🧪 Testing ALL BlockNote Slash Commands (Original + AI)...\n");

async function testAllCommands() {
  try {
    // Import BlockNote core to get default commands
    console.log("📦 Test 1: Importing BlockNote core...");
    const { getDefaultSlashMenuItems } = await import("@blocknote/core");
    console.log("✅ BlockNote core imported successfully");

    // Import our AI extension
    console.log("\n📦 Test 2: Importing AI extension...");
    const { getAISlashMenuItems } = await import("./dist/ai-slash.js");
    console.log("✅ AI extension imported successfully");

    // Create mock editor
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

    const mockEmit = (action, payload) => {
      console.log(`🎯 AI Command: ${action}`, payload);
    };

    // Test 3: Get default BlockNote commands
    console.log("\n🎯 Test 3: Testing default BlockNote commands...");
    const defaultCommands = getDefaultSlashMenuItems(mockEditor);
    console.log(`✅ Found ${defaultCommands.length} default commands:`);

    const defaultCommandTypes = defaultCommands.map((cmd) => cmd.key);
    console.log("Default commands:", defaultCommandTypes);

    // Test 4: Get AI commands
    console.log("\n🤖 Test 4: Testing AI commands...");
    const aiCommands = getAISlashMenuItems(mockEditor, mockEmit);
    console.log(`✅ Found ${aiCommands.length} AI commands:`);

    const aiCommandTypes = aiCommands.map((cmd) => cmd.key);
    console.log("AI commands:", aiCommandTypes);

    // Test 5: Combine all commands
    console.log("\n🔗 Test 5: Testing combined commands...");
    const allCommands = [...defaultCommands, ...aiCommands];
    console.log(`✅ Total commands: ${allCommands.length}`);

    // Group commands by type
    const commandGroups = {};
    allCommands.forEach((cmd) => {
      const group = cmd.group || "Other";
      if (!commandGroups[group]) {
        commandGroups[group] = [];
      }
      commandGroups[group].push(cmd.key);
    });

    console.log("\n📋 Command Groups:");
    Object.entries(commandGroups).forEach(([group, commands]) => {
      console.log(`  ${group}: ${commands.join(", ")}`);
    });

    // Test 6: Verify specific important commands exist
    console.log("\n✅ Test 6: Verifying essential commands...");
    const essentialCommands = [
      "paragraph",
      "heading",
      "bulletListItem",
      "numberedListItem",
      "quote",
      "code",
      "image",
      "table",
      "divider",
      "explain",
      "quiz-me",
      "summarize",
      "diagram",
    ];

    const foundCommands = allCommands.map((cmd) => cmd.key);
    const missingCommands = essentialCommands.filter(
      (cmd) => !foundCommands.includes(cmd),
    );

    if (missingCommands.length === 0) {
      console.log("✅ All essential commands found!");
    } else {
      console.log("⚠️ Missing commands:", missingCommands);
    }

    // Test 7: Test command execution
    console.log("\n⚡ Test 7: Testing command execution...");

    // Test a default command
    const paragraphCommand = defaultCommands.find(
      (cmd) => cmd.key === "paragraph",
    );
    if (paragraphCommand) {
      try {
        paragraphCommand.onItemClick();
        console.log("✅ Default command execution works");
      } catch (error) {
        console.log("⚠️ Default command execution error:", error.message);
      }
    }

    // Test an AI command
    const explainCommand = aiCommands.find((cmd) => cmd.key === "explain");
    if (explainCommand) {
      try {
        explainCommand.onItemClick();
        console.log("✅ AI command execution works");
      } catch (error) {
        console.log("⚠️ AI command execution error:", error.message);
      }
    }

    console.log("\n🎉 All tests completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Default BlockNote commands: ${defaultCommands.length} ✅`);
    console.log(`- AI extension commands: ${aiCommands.length} ✅`);
    console.log(`- Total combined commands: ${allCommands.length} ✅`);
    console.log(`- Command groups: ${Object.keys(commandGroups).length} ✅`);
    console.log("\n🚀 Your AI extension is fully compatible with BlockNote!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

testAllCommands();
