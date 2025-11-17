const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const usernameArg = process.argv[2] || "M0001";
const passwordArg = process.argv[3] || "123456";

if (!/^M\d{4}$/.test(usernameArg)) {
  console.error("❌ 工号必须是 M0001-M9999 格式");
  process.exit(1);
}

async function main() {
  try {
    const mongoURI = process.env.MONGODB_URI ||
      'mongodb+srv://AIO2admin:31493170@cluster0.gpq75zd.mongodb.net/jeyi-toolhub?retryWrites=true&w=majority';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    let user = await User.findOne({ employee_id: usernameArg });

    if (!user) {
      // 创建新用户
      user = new User({
        username: usernameArg,
        employee_id: usernameArg,
        email: `${usernameArg}@jeyi.com`,
        user_type: "非研发",
        role: "admin",
        password_hash: passwordArg  // 让 pre-save 自动加密
      });

      await user.save();
      console.log(`✅ 管理员 ${usernameArg} 创建成功`);

    } else {
      // 更新已有用户
      user.password_hash = passwordArg;
      user.role = "admin";
      user.login_attempts = 0;
      user.lock_until = null;

      await user.save();
      console.log(`🔄 用户 ${usernameArg} 已存在，密码已重置为 ${passwordArg}`);
    }

    console.log("\n📋 管理员账号信息：");
    console.log("   工号:", usernameArg);
    console.log("   用户名:", usernameArg);
    console.log("   密码:", passwordArg);
    console.log("   邮箱:", `${usernameArg}@jeyi.com`);
    console.log("   角色: admin");

  } catch (err) {
    console.error("❌ 失败：", err.message);
  } finally {
    process.exit(0);
  }
}

main();
