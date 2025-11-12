#!/usr/bin/env node

/**
 * MongoDB Atlas 连接字符串生成工具
 * 帮助生成正确格式的连接字符串
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function urlEncode(str) {
  // URL 编码特殊字符
  return encodeURIComponent(str);
}

function generateConnectionString() {
  console.log('\n🔧 MongoDB Atlas 连接字符串生成工具\n');
  console.log('请按照提示输入信息：\n');

  rl.question('1. 请输入集群地址（例如：cluster0.xxxxx.mongodb.net）: ', (cluster) => {
    rl.question('2. 请输入数据库用户名: ', (username) => {
      rl.question('3. 请输入数据库密码: ', (password) => {
        rl.question('4. 请输入数据库名称（默认：jeyi-toolhub）: ', (dbName) => {
          const database = dbName || 'jeyi-toolhub';
          
          // 对用户名和密码进行 URL 编码
          const encodedUsername = urlEncode(username);
          const encodedPassword = urlEncode(password);
          
          // 生成连接字符串
          const connectionString = `mongodb+srv://${encodedUsername}:${encodedPassword}@${cluster}/${database}?retryWrites=true&w=majority`;
          
          console.log('\n✅ 生成的连接字符串：\n');
          console.log(connectionString);
          console.log('\n📋 使用说明：');
          console.log('1. 复制上面的连接字符串');
          console.log('2. 在 Vercel 环境变量中添加：');
          console.log('   - 变量名：MONGODB_URI');
          console.log('   - 变量值：上面的连接字符串');
          console.log('\n⚠️  注意：请妥善保管密码，不要泄露给他人！\n');
          
          rl.close();
        });
      });
    });
  });
}

// 运行
generateConnectionString();

