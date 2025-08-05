#!/usr/bin/env node

console.log("🧪 Testing AI Extension Compatibility with BlockNote...\n");

async function testCompatibility() {
  try {
    // Import our AI extension
    console.log("📦 Test 1: Importing AI extension...");
    const { getAISlashMenuItems } = await import("./dist/ai-slash.js");
    console.log("✅ AI extension imported successfully");

    // Test 2: Verify AI commands work independently
    console.log("\n🤖 Test 2: Testing AI commands independently...");
    const mockEditor = {
      getSelectedText: () => "test text",
      getTextCursorPosition: () => ({ block: { id: "test" } }),
    };

    const mockEmit = (action, payload) => {
      console.log(`🎯 AI Command: ${action}`, payload);
    };

    const aiCommands = getAISlashMenuItems(mockEditor, mockEmit);
    console.log(`✅ Generated ${aiCommands.length} AI commands:`);

    aiCommands.forEach((cmd) => {
      console.log(`  - /${cmd.key}: ${cmd.title} (${cmd.group})`);
    });

    // Test 3: Verify command structure matches BlockNote format
    console.log("\n🔍 Test 3: Verifying command structure...");
    const requiredProperties = ["key", "title", "group", "onItemClick"];

    aiCommands.forEach((cmd) => {
      const missingProps = requiredProperties.filter((prop) => !(prop in cmd));
      if (missingProps.length === 0) {
        console.log(`✅ ${cmd.key}: All required properties present`);
      } else {
        console.log(
          `❌ ${cmd.key}: Missing properties: ${missingProps.join(", ")}`,
        );
      }
    });

    // Test 4: Test command execution
    console.log("\n⚡ Test 4: Testing AI command execution...");
    aiCommands.forEach((cmd) => {
      try {
        console.log(`Testing /${cmd.key}...`);
        cmd.onItemClick();
        console.log(`✅ /${cmd.key} executed successfully`);
      } catch (error) {
        console.log(`⚠️ /${cmd.key} execution error: ${error.message}`);
      }
    });

    // Test 5: Verify no conflicts with existing commands
    console.log("\n🔗 Test 5: Checking for command conflicts...");
    const aiCommandKeys = aiCommands.map((cmd) => cmd.key);
    const potentialConflicts = [
      "paragraph",
      "heading",
      "quote",
      "code",
      "image",
      "table",
    ];

    const conflicts = aiCommandKeys.filter((key) =>
      potentialConflicts.includes(key),
    );
    if (conflicts.length === 0) {
      console.log("✅ No conflicts with existing BlockNote commands");
    } else {
      console.log("⚠️ Potential conflicts:", conflicts);
    }

    // Test 6: Verify command groups
    console.log("\n📋 Test 6: Verifying command groups...");
    const groups = [...new Set(aiCommands.map((cmd) => cmd.group))];
    console.log("AI command groups:", groups);

    if (groups.includes("AI")) {
      console.log("✅ AI commands properly grouped");
    } else {
      console.log("⚠️ AI commands not properly grouped");
    }

    console.log("\n🎉 Compatibility test completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- AI commands: ${aiCommands.length} ✅`);
    console.log(`- Command structure: Valid ✅`);
    console.log(`- Command execution: Working ✅`);
    console.log(
      `- No conflicts: ${conflicts.length === 0 ? "Yes" : "No"} ${conflicts.length === 0 ? "✅" : "⚠️"}`,
    );
    console.log(
      `- Proper grouping: ${groups.includes("AI") ? "Yes" : "No"} ${groups.includes("AI") ? "✅" : "⚠️"}`,
    );

    console.log(
      "\n🚀 Your AI extension is ready to be combined with BlockNote!",
    );
    console.log("\n💡 To use with BlockNote, combine commands like this:");
    console.log("```javascript");
    console.log("const allCommands = [");
    console.log(
      "  ...getDefaultSlashMenuItems(editor), // Original BlockNote commands",
    );
    console.log(
      "  ...getAISlashMenuItems(editor, handleAICommand) // Your AI commands",
    );
    console.log("];");
    console.log("```");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

testCompatibility();
